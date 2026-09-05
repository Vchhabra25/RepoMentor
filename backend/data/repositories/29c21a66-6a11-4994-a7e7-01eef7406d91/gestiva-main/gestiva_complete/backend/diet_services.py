import csv
import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = BASE_DIR / "datasets"
DATA_DIR = BASE_DIR / "backend" / "data"
DB_PATH = DATA_DIR / "gestiva_diet.db"


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def load_csv(name):
    path = DATASET_DIR / name
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def parse_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value).replace(";", ",").split(",") if item.strip()]


def normalize(value):
    return str(value or "").strip().lower()


def as_float(value, default=0.0):
    try:
        if value in (None, ""):
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


class DietRepository:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.init_db()

    def connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS user_profiles (
                    user_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    age INTEGER NOT NULL,
                    height REAL NOT NULL,
                    weight REAL NOT NULL,
                    pregnancy_week INTEGER NOT NULL,
                    expected_due_date TEXT,
                    food_preference TEXT NOT NULL,
                    allergies TEXT NOT NULL,
                    medical_conditions TEXT NOT NULL,
                    ayurvedic_body_type TEXT,
                    body_type_scores TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS diet_plans (
                    plan_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    questionnaire TEXT NOT NULL,
                    plan_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES user_profiles(user_id)
                );
                """
            )

    def upsert_profile(self, payload):
        now = utc_now()
        user_id = payload["user_id"]
        existing = self.get_profile(user_id)
        created_at = existing.get("created_at") if existing else now
        record = {
            "user_id": user_id,
            "name": payload["name"].strip(),
            "age": int(payload["age"]),
            "height": float(payload["height"]),
            "weight": float(payload["weight"]),
            "pregnancy_week": int(payload["pregnancy_week"]),
            "expected_due_date": payload.get("expected_due_date", ""),
            "food_preference": payload.get("food_preference", "Vegetarian"),
            "allergies": json.dumps(parse_list(payload.get("allergies"))),
            "medical_conditions": json.dumps(parse_list(payload.get("medical_conditions"))),
            "ayurvedic_body_type": existing.get("ayurvedic_body_type") if existing else None,
            "body_type_scores": existing.get("body_type_scores") if existing else None,
            "created_at": created_at,
            "updated_at": now,
        }
        with self.connect() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO user_profiles (
                    user_id, name, age, height, weight, pregnancy_week, expected_due_date,
                    food_preference, allergies, medical_conditions, ayurvedic_body_type,
                    body_type_scores, created_at, updated_at
                ) VALUES (
                    :user_id, :name, :age, :height, :weight, :pregnancy_week, :expected_due_date,
                    :food_preference, :allergies, :medical_conditions, :ayurvedic_body_type,
                    :body_type_scores, :created_at, :updated_at
                )
                """,
                record,
            )
        return self.get_profile(user_id)

    def get_profile(self, user_id):
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM user_profiles WHERE user_id = ?", (user_id,)).fetchone()
        if not row:
            return None
        item = dict(row)
        item["allergies"] = json.loads(item.get("allergies") or "[]")
        item["medical_conditions"] = json.loads(item.get("medical_conditions") or "[]")
        item["body_type_scores"] = json.loads(item["body_type_scores"]) if item.get("body_type_scores") else None
        return item

    def delete_profile(self, user_id):
        with self.connect() as conn:
            conn.execute("DELETE FROM diet_plans WHERE user_id = ?", (user_id,))
            result = conn.execute("DELETE FROM user_profiles WHERE user_id = ?", (user_id,))
        return result.rowcount > 0

    def update_body_type(self, user_id, body_type, scores):
        with self.connect() as conn:
            conn.execute(
                "UPDATE user_profiles SET ayurvedic_body_type = ?, body_type_scores = ?, updated_at = ? WHERE user_id = ?",
                (body_type, json.dumps(scores), utc_now(), user_id),
            )
        return self.get_profile(user_id)

    def save_plan(self, user_id, questionnaire, plan):
        plan_id = str(uuid.uuid4())
        now = utc_now()
        plan["plan_id"] = plan_id
        plan["created_at"] = now
        with self.connect() as conn:
            conn.execute(
                "INSERT INTO diet_plans (plan_id, user_id, questionnaire, plan_json, created_at) VALUES (?, ?, ?, ?, ?)",
                (plan_id, user_id, json.dumps(questionnaire), json.dumps(plan), now),
            )
        return plan

    def list_plans(self, user_id):
        with self.connect() as conn:
            rows = conn.execute(
                "SELECT plan_id, questionnaire, plan_json, created_at FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC",
                (user_id,),
            ).fetchall()
        plans = []
        for row in rows:
            plan = json.loads(row["plan_json"])
            plan["questionnaire"] = json.loads(row["questionnaire"])
            plans.append(plan)
        return plans

    def get_plan(self, user_id, plan_id):
        with self.connect() as conn:
            row = conn.execute(
                "SELECT questionnaire, plan_json FROM diet_plans WHERE user_id = ? AND plan_id = ?",
                (user_id, plan_id),
            ).fetchone()
        if not row:
            return None
        plan = json.loads(row["plan_json"])
        plan["questionnaire"] = json.loads(row["questionnaire"])
        return plan


class DietRecommendationEngine:
    def __init__(self):
        self.nutrition = load_csv("pregnancy_nutrition.csv")
        self.indian_foods = load_csv("indian_foods.csv")
        self.ayurveda = load_csv("ayurveda_foods.csv")
        self.symptoms = load_csv("symptom_food_mapping.csv")
        self.weeks = load_csv("pregnancy_week_guidelines.csv")
        self.ayurveda_by_name = {normalize(row["Food_Name"]): row for row in self.ayurveda}

    def classify_body_type(self, answers):
        scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
        mapping = {
            "body_frame": {"thin": "Vata", "medium": "Pitta", "broad": "Kapha"},
            "skin": {"dry": "Vata", "sensitive": "Pitta", "oily": "Kapha"},
            "appetite": {"irregular": "Vata", "strong": "Pitta", "steady": "Kapha"},
            "sleep": {"light": "Vata", "moderate": "Pitta", "deep": "Kapha"},
            "energy": {"variable": "Vata", "intense": "Pitta", "stable": "Kapha"},
            "digestion": {"gas": "Vata", "acidity": "Pitta", "slow": "Kapha"},
            "stress_response": {"anxious": "Vata", "irritable": "Pitta", "withdrawn": "Kapha"},
            "weather_sensitivity": {"cold": "Vata", "heat": "Pitta", "damp": "Kapha"},
        }
        for key, choices in mapping.items():
            answer = normalize(answers.get(key))
            if answer in choices:
                scores[choices[answer]] += 1
        body_type = max(scores, key=scores.get)
        return body_type, scores

    def validate_profile(self, payload):
        errors = {}
        required = ["user_id", "name", "age", "height", "weight", "pregnancy_week", "food_preference"]
        for field in required:
            if payload.get(field) in (None, ""):
                errors[field] = "Required"
        if "age" not in errors and not 13 <= int(payload["age"]) <= 55:
            errors["age"] = "Age must be between 13 and 55"
        if "height" not in errors and not 100 <= float(payload["height"]) <= 220:
            errors["height"] = "Height must be in centimeters"
        if "weight" not in errors and not 30 <= float(payload["weight"]) <= 180:
            errors["weight"] = "Weight must be in kilograms"
        if "pregnancy_week" not in errors and not 1 <= int(payload["pregnancy_week"]) <= 40:
            errors["pregnancy_week"] = "Pregnancy week must be 1-40"
        return errors

    def validate_questionnaire(self, payload):
        errors = {}
        required = ["user_id", "pregnancy_week", "current_symptoms", "water_intake", "activity_level", "sleep_duration", "food_preference"]
        for field in required:
            if payload.get(field) in (None, ""):
                errors[field] = "Required"
        if "pregnancy_week" not in errors and not 1 <= int(payload["pregnancy_week"]) <= 40:
            errors["pregnancy_week"] = "Pregnancy week must be 1-40"
        if "water_intake" not in errors and not 0 <= float(payload["water_intake"]) <= 8:
            errors["water_intake"] = "Water intake must be liters per day"
        if "sleep_duration" not in errors and not 0 <= float(payload["sleep_duration"]) <= 14:
            errors["sleep_duration"] = "Sleep duration must be hours per night"
        return errors

    def trimester_for_week(self, week):
        if week <= 13:
            return "First"
        if week <= 27:
            return "Second"
        return "Third"

    def week_guideline(self, week):
        for row in self.weeks:
            if int(row["Week"]) == int(week):
                return row
        return self.weeks[-1]

    def symptom_rows(self, symptoms, trimester):
        selected = []
        symptom_names = {normalize(item) for item in symptoms}
        for row in self.symptoms:
            if normalize(row["Symptom"]) in symptom_names and row["Pregnancy_Trimester"] == trimester:
                selected.append(row)
        return selected

    def build_food_pool(self, questionnaire, profile):
        preference = normalize(questionnaire.get("food_preference") or profile.get("food_preference"))
        allergies = [normalize(item) for item in parse_list(questionnaire.get("allergies")) + profile.get("allergies", [])]
        conditions = [normalize(item) for item in parse_list(questionnaire.get("existing_diseases")) + profile.get("medical_conditions", [])]
        if as_float(questionnaire.get("blood_sugar")) >= 140 and "gestational diabetes" not in conditions:
            conditions.append("gestational diabetes")
        bp = normalize(questionnaire.get("blood_pressure"))
        systolic = as_float(bp.split("/")[0]) if "/" in bp else 0
        if systolic >= 140 and "hypertension" not in conditions:
            conditions.append("hypertension")
        if as_float(questionnaire.get("hemoglobin")) and as_float(questionnaire.get("hemoglobin")) < 11:
            conditions.append("anemia")

        pool = []
        for row in self.nutrition:
            text = normalize(" ".join(row.values()))
            if row["Pregnancy_Safe"] == "No":
                continue
            if preference.startswith("veg") and row["Vegetarian"] != "Yes":
                continue
            if any(allergy and allergy in text for allergy in allergies):
                continue
            if any(term in conditions for term in ["gestational diabetes", "diabetes"]):
                if as_float(row["Glycemic_Index"], 99) > 55:
                    continue
            if any(term in conditions for term in ["hypertension", "high blood pressure"]):
                if as_float(row["Sodium"], 0) > 180:
                    continue
            item = dict(row)
            item["_score"] = 0.0
            pool.append(item)
        return pool, conditions

    def score_food(self, food, meal, symptoms, conditions, body_type):
        score = 0.0
        category = food["Category"]
        name = normalize(food["Food_Name"])
        benefits = normalize(food.get("Health_Benefits"))
        meal_categories = {
            "breakfast": ["Whole Grains", "Indian Prepared Foods", "Dairy", "Pulses", "Eggs"],
            "mid_morning_snack": ["Fruits", "Dairy", "Nuts & Seeds"],
            "lunch": ["Indian Prepared Foods", "Pulses", "Whole Grains", "Vegetables", "Fish", "Lean Meats"],
            "evening_snack": ["Fruits", "Nuts & Seeds", "Dairy", "Indian Prepared Foods"],
            "dinner": ["Indian Prepared Foods", "Pulses", "Vegetables", "Dairy", "Fish", "Lean Meats"],
        }
        if category in meal_categories[meal]:
            score += 8
        for symptom in symptoms:
            s = normalize(symptom)
            if s in ["constipation"] and ("fiber" in benefits or as_float(food["Fiber_g"]) >= 4):
                score += 6
            if s in ["anemia", "fatigue"] and (as_float(food["Iron_mg"]) >= 1.8 or as_float(food["Folate_mcg"]) >= 60):
                score += 6
            if s in ["leg cramps", "headache", "dehydration"] and as_float(food["Potassium"]) >= 250:
                score += 4
            if s in ["acidity", "heartburn", "nausea", "morning sickness"] and category in ["Dairy", "Whole Grains", "Fruits", "Indian Prepared Foods"]:
                score += 3
        if any(c in conditions for c in ["gestational diabetes", "diabetes"]):
            score += max(0, 6 - as_float(food["Glycemic_Index"]) / 12)
        if "anemia" in conditions:
            score += as_float(food["Iron_mg"]) + as_float(food["Folate_mcg"]) / 80
        if any(c in conditions for c in ["hypertension", "high blood pressure"]):
            score += max(0, 4 - as_float(food["Sodium"]) / 80)
        ay = self.ayurveda_by_name.get(name)
        if ay and body_type:
            effect = normalize(ay.get(f"{body_type}_Effect"))
            if "pacifies" in effect:
                score += 4
            if "increase" in effect:
                score -= 4
        return score

    def choose_foods(self, pool, meal, count, symptoms, conditions, body_type, used):
        ranked = []
        for food in pool:
            if food["Food_Name"] in used:
                continue
            food = dict(food)
            food["_score"] = self.score_food(food, meal, symptoms, conditions, body_type)
            ranked.append(food)
        ranked.sort(key=lambda row: (-row["_score"], row["Category"], row["Food_Name"]))
        selected = ranked[:count]
        used.update(item["Food_Name"] for item in selected)
        return selected

    def explain(self, food, symptoms, body_type):
        reason = food.get("Health_Benefits", "nutrient support")
        symptom_text = ""
        if symptoms:
            symptom_text = f" and supports concerns such as {', '.join(symptoms[:2])}"
        body_text = f" It is also compatible with the stored {body_type} body-type balance." if body_type else ""
        return f"{food['Food_Name']} is recommended because it provides {reason}{symptom_text}.{body_text}"

    def nutrition_summary(self, meals):
        totals = {"calories": 0, "protein_g": 0, "carbohydrates_g": 0, "fat_g": 0, "fiber_g": 0, "iron_mg": 0, "calcium_mg": 0, "folate_mcg": 0}
        for items in meals.values():
            for item in items:
                totals["calories"] += as_float(item["Calories_per_100g"])
                totals["protein_g"] += as_float(item["Protein_g"])
                totals["carbohydrates_g"] += as_float(item["Carbohydrates_g"])
                totals["fat_g"] += as_float(item["Fat_g"])
                totals["fiber_g"] += as_float(item["Fiber_g"])
                totals["iron_mg"] += as_float(item["Iron_mg"])
                totals["calcium_mg"] += as_float(item["Calcium_mg"])
                totals["folate_mcg"] += as_float(item["Folate_mcg"])
        return {key: round(value, 1) for key, value in totals.items()}

    def generate_plan(self, questionnaire, profile):
        week = int(questionnaire["pregnancy_week"])
        trimester = self.trimester_for_week(week)
        symptoms = parse_list(questionnaire.get("current_symptoms"))
        pool, conditions = self.build_food_pool(questionnaire, profile)
        body_type = profile.get("ayurvedic_body_type")
        guideline = self.week_guideline(week)
        symptom_matches = self.symptom_rows(symptoms, trimester)
        used = set()
        meals = {
            "breakfast": self.choose_foods(pool, "breakfast", 3, symptoms, conditions, body_type, used),
            "mid_morning_snack": self.choose_foods(pool, "mid_morning_snack", 2, symptoms, conditions, body_type, used),
            "lunch": self.choose_foods(pool, "lunch", 4, symptoms, conditions, body_type, used),
            "evening_snack": self.choose_foods(pool, "evening_snack", 2, symptoms, conditions, body_type, used),
            "dinner": self.choose_foods(pool, "dinner", 4, symptoms, conditions, body_type, used),
        }
        foods_to_avoid = []
        for row in symptom_matches:
            foods_to_avoid.extend(parse_list(row.get("Foods_to_Avoid")))
        foods_to_avoid.extend(parse_list(guideline.get("Foods_To_Avoid")))
        foods_to_avoid = sorted(set(item for item in foods_to_avoid if item))
        water_goal = guideline.get("Water_Intake", "2.3-3.0 L fluids/day")
        if as_float(questionnaire.get("water_intake")) < 2:
            water_goal = f"{water_goal}; increase gradually from current intake"

        serialized_meals = {}
        explanations = {}
        for meal, items in meals.items():
            serialized_meals[meal] = [
                {
                    "food_id": item["Food_ID"],
                    "food_name": item["Food_Name"],
                    "category": item["Category"],
                    "serving_size": item["Serving_Size"],
                    "calories_per_100g": as_float(item["Calories_per_100g"]),
                    "protein_g": as_float(item["Protein_g"]),
                    "fiber_g": as_float(item["Fiber_g"]),
                    "iron_mg": as_float(item["Iron_mg"]),
                    "calcium_mg": as_float(item["Calcium_mg"]),
                    "glycemic_index": as_float(item["Glycemic_Index"]),
                }
                for item in items
            ]
            explanations[meal] = [self.explain(item, symptoms, body_type) for item in items]

        return {
            "user_id": questionnaire["user_id"],
            "pregnancy_week": week,
            "trimester": trimester,
            "ayurvedic_body_type": body_type,
            "medical_conditions_considered": conditions,
            "meals": serialized_meals,
            "water_intake_goal": water_goal,
            "daily_nutritional_summary": self.nutrition_summary(meals),
            "foods_to_avoid": foods_to_avoid,
            "ai_explanations": explanations,
            "week_guidance": {
                "baby_development": guideline.get("Baby_Development"),
                "mother_changes": guideline.get("Mother_Changes"),
                "exercise": guideline.get("Exercise"),
                "medical_checkups": guideline.get("Medical_Checkups"),
                "warning_signs": guideline.get("Warning_Signs"),
                "sleep_recommendation": guideline.get("Sleep_Recommendation"),
            },
            "symptom_guidance": symptom_matches,
        }

    def compare_plans(self, previous, current):
        previous_foods = {
            item["food_name"]
            for items in previous.get("meals", {}).values()
            for item in items
        }
        current_foods = {
            item["food_name"]
            for items in current.get("meals", {}).values()
            for item in items
        }
        return {
            "previous_plan_id": previous.get("plan_id"),
            "current_plan_id": current.get("plan_id"),
            "added_foods": sorted(current_foods - previous_foods),
            "removed_foods": sorted(previous_foods - current_foods),
            "unchanged_foods": sorted(previous_foods & current_foods),
            "nutrition_delta": {
                key: round(current.get("daily_nutritional_summary", {}).get(key, 0) - previous.get("daily_nutritional_summary", {}).get(key, 0), 1)
                for key in current.get("daily_nutritional_summary", {})
            },
        }
