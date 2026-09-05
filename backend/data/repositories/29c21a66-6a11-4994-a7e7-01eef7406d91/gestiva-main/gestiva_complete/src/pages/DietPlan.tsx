import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ClipboardList,
  Droplets,
  History,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
  Utensils,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const USER_ID_KEY = "gestiva_diet_user_id";

type MealItem = {
  food_id: string;
  food_name: string;
  category: string;
  serving_size: string;
  calories_per_100g: number;
  protein_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  glycemic_index: number;
};

type DietPlanResult = {
  plan_id?: string;
  created_at?: string;
  pregnancy_week: number;
  trimester: string;
  ayurvedic_body_type?: string;
  meals: Record<string, MealItem[]>;
  water_intake_goal: string;
  daily_nutritional_summary: Record<string, number>;
  foods_to_avoid: string[];
  ai_explanations: Record<string, string[]>;
  week_guidance: Record<string, string>;
  medical_conditions_considered: string[];
};

const getUserId = () => {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;
  const created = "gestiva-demo-user";
  localStorage.setItem(USER_ID_KEY, created);
  return created;
};

const requestJson = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload as T;
};

const mealLabels: Record<string, string> = {
  breakfast: "Breakfast",
  mid_morning_snack: "Mid-Morning Snack",
  lunch: "Lunch",
  evening_snack: "Evening Snack",
  dinner: "Dinner",
};

const symptoms = [
  "Morning sickness",
  "Nausea",
  "Vomiting",
  "Acidity",
  "Constipation",
  "Heartburn",
  "Fatigue",
  "Anemia",
  "Gestational diabetes",
  "Hypertension",
  "Swelling",
  "Stress",
  "Anxiety",
  "Insomnia",
  "Back pain",
  "Leg cramps",
  "Low appetite",
  "Headache",
  "Dehydration",
];

const DietPlan = () => {
  const { toast } = useToast();
  const userId = useMemo(getUserId, []);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<DietPlanResult | null>(null);
  const [history, setHistory] = useState<DietPlanResult[]>([]);
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(null);
  const [compareIds, setCompareIds] = useState({ previous: "", current: "" });
  const [profile, setProfile] = useState({
    user_id: userId,
    name: "",
    age: "28",
    height: "160",
    weight: "62",
    pregnancy_week: "20",
    expected_due_date: "",
    food_preference: "Vegetarian",
    allergies: "",
    medical_conditions: "",
  });
  const [questionnaire, setQuestionnaire] = useState({
    user_id: userId,
    pregnancy_week: "20",
    current_symptoms: "Fatigue, Constipation",
    water_intake: "2.2",
    activity_level: "Moderate",
    sleep_duration: "7",
    food_preference: "Vegetarian",
    allergies: "",
    existing_diseases: "",
    blood_pressure: "",
    blood_sugar: "",
    hemoglobin: "",
  });
  const [bodyAnswers, setBodyAnswers] = useState({
    body_frame: "",
    skin: "",
    appetite: "",
    sleep: "",
    energy: "",
    digestion: "",
    stress_response: "",
    weather_sensitivity: "",
  });
  const [bodyType, setBodyType] = useState("");

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await requestJson<{ plans: DietPlanResult[] }>(`/api/diet/plans/${userId}`);
      setHistory(data.plans);
      if (!activePlan && data.plans.length) setActivePlan(data.plans[0]);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const saved = await requestJson<{ ayurvedic_body_type?: string } & typeof profile>(
          `/api/diet/profile/${userId}`,
        );
        setProfile((prev) => ({
          ...prev,
          name: saved.name || prev.name,
          age: String(saved.age || prev.age),
          height: String(saved.height || prev.height),
          weight: String(saved.weight || prev.weight),
          pregnancy_week: String(saved.pregnancy_week || prev.pregnancy_week),
          expected_due_date: saved.expected_due_date || "",
          food_preference: saved.food_preference || prev.food_preference,
          allergies: Array.isArray(saved.allergies) ? saved.allergies.join(", ") : "",
          medical_conditions: Array.isArray(saved.medical_conditions) ? saved.medical_conditions.join(", ") : "",
        }));
        setQuestionnaire((prev) => ({
          ...prev,
          pregnancy_week: String(saved.pregnancy_week || prev.pregnancy_week),
          food_preference: saved.food_preference || prev.food_preference,
          allergies: Array.isArray(saved.allergies) ? saved.allergies.join(", ") : "",
          existing_diseases: Array.isArray(saved.medical_conditions) ? saved.medical_conditions.join(", ") : "",
        }));
        setBodyType(saved.ayurvedic_body_type || "");
      } catch {
        // A missing profile is expected for first-time users.
      }
      loadHistory();
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const updateProfile = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (field === "pregnancy_week" || field === "food_preference") {
      setQuestionnaire((prev) => ({ ...prev, [field]: value }));
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await requestJson("/api/diet/profile", {
        method: "POST",
        body: JSON.stringify(profile),
      });
      toast({ title: "Profile saved", description: "Your diet profile is stored securely in the backend." });
    } catch (error) {
      toast({ title: "Unable to save profile", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const classifyBodyType = async () => {
    setLoading(true);
    try {
      const data = await requestJson<{ body_type: string; scores: Record<string, number> }>("/api/diet/body-type", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, answers: bodyAnswers }),
      });
      setBodyType(data.body_type);
      toast({
        title: `${data.body_type} body type saved`,
        description: `Scores: Vata ${data.scores.Vata}, Pitta ${data.scores.Pitta}, Kapha ${data.scores.Kapha}`,
      });
    } catch (error) {
      toast({ title: "Body type not saved", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    setComparison(null);
    try {
      const data = await requestJson<{ plan: DietPlanResult }>("/api/diet/plans/generate", {
        method: "POST",
        body: JSON.stringify(questionnaire),
      });
      setActivePlan(data.plan);
      toast({ title: "Diet plan generated", description: "Recommendations were selected from the dataset engine." });
      await loadHistory();
    } catch (error) {
      toast({ title: "Unable to generate plan", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const comparePlans = async () => {
    if (!compareIds.previous || !compareIds.current) {
      toast({ title: "Select two plans", description: "Choose previous and current plans to compare.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await requestJson<{ comparison: Record<string, unknown> }>(
        `/api/diet/plans/${userId}/compare?previous=${compareIds.previous}&current=${compareIds.current}`,
      );
      setComparison(data.comparison);
    } catch (error) {
      toast({ title: "Comparison failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    const current = questionnaire.current_symptoms
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const next = current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom];
    setQuestionnaire((prev) => ({ ...prev, current_symptoms: next.join(", ") }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30 p-6">
      <div
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gestiva-darkest">Personalized Diet Plan</h1>
            <p className="text-gestiva-dark">Dataset-driven pregnancy nutrition recommendations</p>
          </div>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="body">Body Type</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-gestiva-darkest flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Field label="Name" value={profile.name} onChange={(value) => updateProfile("name", value)} />
                <Field label="Age" type="number" value={profile.age} onChange={(value) => updateProfile("age", value)} />
                <Field label="Height (cm)" type="number" value={profile.height} onChange={(value) => updateProfile("height", value)} />
                <Field label="Weight (kg)" type="number" value={profile.weight} onChange={(value) => updateProfile("weight", value)} />
                <Field label="Pregnancy Week" type="number" value={profile.pregnancy_week} onChange={(value) => updateProfile("pregnancy_week", value)} />
                <Field label="Expected Due Date" type="date" value={profile.expected_due_date} onChange={(value) => updateProfile("expected_due_date", value)} />
                <div>
                  <Label>Food Preference</Label>
                  <Select value={profile.food_preference} onValueChange={(value) => updateProfile("food_preference", value)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Area label="Allergies" value={profile.allergies} onChange={(value) => updateProfile("allergies", value)} />
                <Area label="Existing Medical Conditions" value={profile.medical_conditions} onChange={(value) => updateProfile("medical_conditions", value)} />
                <div className="md:col-span-3">
                  <Button onClick={saveProfile} disabled={loading} className="bg-gestiva-medium hover:bg-gestiva-dark">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="body">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-gestiva-darkest flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Ayurvedic Body Type Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4">
                <BodySelect label="Body Frame" field="body_frame" values={["thin", "medium", "broad"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Skin" field="skin" values={["dry", "sensitive", "oily"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Appetite" field="appetite" values={["irregular", "strong", "steady"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Sleep" field="sleep" values={["light", "moderate", "deep"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Energy" field="energy" values={["variable", "intense", "stable"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Digestion" field="digestion" values={["gas", "acidity", "slow"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Stress Response" field="stress_response" values={["anxious", "irritable", "withdrawn"]} state={bodyAnswers} setState={setBodyAnswers} />
                <BodySelect label="Weather Sensitivity" field="weather_sensitivity" values={["cold", "heat", "damp"]} state={bodyAnswers} setState={setBodyAnswers} />
                <div className="md:col-span-4 flex items-center gap-3">
                  <Button onClick={classifyBodyType} disabled={loading} className="bg-gestiva-medium hover:bg-gestiva-dark">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Classify and Save
                  </Button>
                  {bodyType && <Badge className="bg-gestiva-medium text-white">{bodyType}</Badge>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate">
            <div className="grid lg:grid-cols-[360px_1fr] gap-6">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gestiva-darkest">Diet Questionnaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field label="Pregnancy Week" type="number" value={questionnaire.pregnancy_week} onChange={(value) => setQuestionnaire((p) => ({ ...p, pregnancy_week: value }))} />
                  <div>
                    <Label>Current Symptoms</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {symptoms.map((symptom) => {
                        const active = questionnaire.current_symptoms.includes(symptom);
                        return (
                          <button
                            type="button"
                            key={symptom}
                            onClick={() => toggleSymptom(symptom)}
                            className={`rounded-full border px-3 py-1 text-xs ${active ? "bg-gestiva-medium text-white border-gestiva-medium" : "bg-white text-gestiva-dark border-gestiva-light"}`}
                          >
                            {symptom}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Field label="Water Intake (L/day)" type="number" value={questionnaire.water_intake} onChange={(value) => setQuestionnaire((p) => ({ ...p, water_intake: value }))} />
                  <Field label="Sleep Duration (hours)" type="number" value={questionnaire.sleep_duration} onChange={(value) => setQuestionnaire((p) => ({ ...p, sleep_duration: value }))} />
                  <div>
                    <Label>Activity Level</Label>
                    <Select value={questionnaire.activity_level} onValueChange={(value) => setQuestionnaire((p) => ({ ...p, activity_level: value }))}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Food Preference</Label>
                    <Select value={questionnaire.food_preference} onValueChange={(value) => setQuestionnaire((p) => ({ ...p, food_preference: value }))}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Area label="Allergies" value={questionnaire.allergies} onChange={(value) => setQuestionnaire((p) => ({ ...p, allergies: value }))} />
                  <Area label="Existing Diseases" value={questionnaire.existing_diseases} onChange={(value) => setQuestionnaire((p) => ({ ...p, existing_diseases: value }))} />
                  <Field label="Blood Pressure (optional)" placeholder="120/80" value={questionnaire.blood_pressure} onChange={(value) => setQuestionnaire((p) => ({ ...p, blood_pressure: value }))} />
                  <Field label="Blood Sugar (optional)" type="number" value={questionnaire.blood_sugar} onChange={(value) => setQuestionnaire((p) => ({ ...p, blood_sugar: value }))} />
                  <Field label="Hemoglobin (optional)" type="number" value={questionnaire.hemoglobin} onChange={(value) => setQuestionnaire((p) => ({ ...p, hemoglobin: value }))} />
                  <Button onClick={generatePlan} disabled={loading} className="w-full bg-gestiva-medium hover:bg-gestiva-dark">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                    Generate Diet Plan
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {activePlan ? <PlanView plan={activePlan} /> : <EmptyPlan />}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-gestiva-darkest flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Diet History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {historyLoading && <p className="text-gestiva-dark">Loading previous plans...</p>}
                <div className="grid md:grid-cols-2 gap-3">
                  {history.map((plan) => (
                    <button
                      key={plan.plan_id}
                      type="button"
                      onClick={() => setActivePlan(plan)}
                      className="text-left rounded-lg border border-gestiva-light bg-white p-4 hover:border-gestiva-medium"
                    >
                      <div className="font-semibold text-gestiva-darkest">Week {plan.pregnancy_week} - {plan.trimester}</div>
                      <div className="text-sm text-gestiva-dark">{plan.created_at ? new Date(plan.created_at).toLocaleString() : "Saved plan"}</div>
                      <div className="mt-2 text-xs text-gestiva-dark">Plan ID: {plan.plan_id}</div>
                    </button>
                  ))}
                </div>
                <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                  <PlanSelect label="Previous Plan" value={compareIds.previous} plans={history} onChange={(value) => setCompareIds((p) => ({ ...p, previous: value }))} />
                  <PlanSelect label="Current Plan" value={compareIds.current} plans={history} onChange={(value) => setCompareIds((p) => ({ ...p, current: value }))} />
                  <Button onClick={comparePlans} disabled={loading} className="bg-gestiva-medium hover:bg-gestiva-dark">
                    Compare
                  </Button>
                </div>
                {comparison && (
                  <pre className="overflow-auto rounded-lg bg-gestiva-light/20 p-4 text-sm text-gestiva-dark">
                    {JSON.stringify(comparison, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 border-gestiva-light focus:border-gestiva-medium"
    />
  </div>
);

const Area = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <div>
    <Label>{label}</Label>
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1 border-gestiva-light focus:border-gestiva-medium"
      placeholder="Comma-separated values"
    />
  </div>
);

const BodySelect = ({ label, field, values, state, setState }: {
  label: string;
  field: string;
  values: string[];
  state: Record<string, string>;
  setState: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => (
  <div>
    <Label>{label}</Label>
    <Select value={state[field]} onValueChange={(value) => setState((prev) => ({ ...prev, [field]: value }))}>
      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
      <SelectContent>
        {values.map((value) => (
          <SelectItem key={value} value={value}>{value}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const PlanSelect = ({ label, value, plans, onChange }: {
  label: string;
  value: string;
  plans: DietPlanResult[];
  onChange: (value: string) => void;
}) => (
  <div>
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="mt-1"><SelectValue placeholder="Select plan" /></SelectTrigger>
      <SelectContent>
        {plans.map((plan) => (
          <SelectItem key={plan.plan_id} value={plan.plan_id || ""}>
            Week {plan.pregnancy_week} - {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : plan.plan_id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const EmptyPlan = () => (
  <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
    <CardContent className="p-8 text-center text-gestiva-dark">
      <Utensils className="w-12 h-12 mx-auto mb-3 text-gestiva-medium" />
      Save your profile, classify body type, then generate a personalized plan from the nutrition datasets.
    </CardContent>
  </Card>
);

const PlanView = ({ plan }: { plan: DietPlanResult }) => (
  <>
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-gestiva-darkest flex flex-wrap items-center gap-2">
          <Utensils className="w-5 h-5" />
          Week {plan.pregnancy_week} Diet Plan
          <Badge variant="secondary">{plan.trimester} trimester</Badge>
          {plan.ayurvedic_body_type && <Badge className="bg-gestiva-medium text-white">{plan.ayurvedic_body_type}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 text-blue-900">
          <Droplets className="w-5 h-5 mt-0.5" />
          <div>
            <div className="font-semibold">Water Intake Goal</div>
            <div>{plan.water_intake_goal}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(plan.meals).map(([meal, items]) => (
            <Card key={meal} className="border-gestiva-light">
              <CardHeader className="bg-gestiva-light/20">
                <CardTitle className="text-base text-gestiva-darkest">{mealLabels[meal] || meal}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {items.map((item, index) => (
                  <div key={item.food_id} className="rounded-lg border border-gestiva-light/70 p-3">
                    <div className="font-semibold text-gestiva-darkest">{item.food_name}</div>
                    <div className="text-sm text-gestiva-dark">{item.serving_size} - {item.category}</div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gestiva-dark">
                      <span>{item.calories_per_100g} kcal/100g</span>
                      <span>{item.protein_g} g protein</span>
                      <span>{item.fiber_g} g fiber</span>
                      <span>GI {item.glycemic_index}</span>
                    </div>
                    <p className="mt-2 text-sm text-gestiva-dark">{plan.ai_explanations[meal]?.[index]}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader><CardTitle className="text-gestiva-darkest">Daily Nutritional Summary</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {Object.entries(plan.daily_nutritional_summary).map(([key, value]) => (
            <div key={key} className="rounded-lg bg-gestiva-light/20 p-3">
              <div className="text-xs uppercase text-gestiva-dark">{key.replaceAll("_", " ")}</div>
              <div className="font-bold text-gestiva-darkest">{value}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardHeader><CardTitle className="text-gestiva-darkest">Foods To Avoid</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {plan.foods_to_avoid.map((food) => (
            <Badge key={food} variant="outline" className="bg-white">{food}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  </>
);

export default DietPlan;
