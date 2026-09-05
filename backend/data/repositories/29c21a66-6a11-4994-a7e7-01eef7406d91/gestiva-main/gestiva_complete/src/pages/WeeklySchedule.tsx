import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle2,
  Baby,
  Droplets,
  Activity,
  Pill,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

const todayTasks = [
  {
    id:1,
    title:"Drink 3L Water",
    completed:false,
    category:"Hydration",
    icon:Droplets
}
];

const WeeklySchedule = () => {
  const [tasks,setTasks]=useState(todayTasks);
const [week,setWeek]=useState(24);
const [water,setWater]=useState(21);
const [walking,setWalking]=useState(4);
const [meals,setMeals]=useState(18);
const [mood,setMood]=useState("Happy");
const [doctor,setDoctor]=useState("Dr. Priya Sharma");
const [appointment,setAppointment]=useState("30 July • 11:00 AM");
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-pink-700">
              Weekly Pregnancy Schedule
            </h1>

            <p className="text-gray-600 mt-2">
              Stay on track with your pregnancy journey.
            </p>
          </div>

          <Button className="bg-pink-600 hover:bg-pink-700">
            <Calendar className="mr-2 h-5 w-5" />
            Week 24
          </Button>
        </div>

        {/* Progress */}

        <Card className="mb-8">

          <CardHeader>

            <CardTitle>Pregnancy Progress</CardTitle>

          </CardHeader>

          <CardContent>

            <Progress value={60} />

            <p className="mt-3 text-gray-600">
              Week 24 of 40 • Second Trimester
            </p>

          </CardContent>

        </Card>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Today's Checklist */}

          <Card className="lg:col-span-2">

            <CardHeader>

              <CardTitle>Today's Checklist</CardTitle>

            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                {todayTasks.map((task) => {

                  const Icon = task.icon;

                  return (
                    <div
                      key={task.title}
                      className="flex items-center justify-between p-4 rounded-xl border hover:bg-pink-50 transition"
                    >
                      <div className="flex items-center gap-3">

                        <Icon className="text-pink-600 h-5 w-5" />

                        <span>{task.title}</span>

                      </div>

                      <Button size="sm">
                        Complete
                      </Button>

                    </div>
                  );
                })}
              </div>

            </CardContent>

          </Card>

          {/* Baby Development */}

          <Card>

            <CardHeader>

              <CardTitle>Baby Development</CardTitle>

            </CardHeader>

            <CardContent>

              <Baby
                className="mx-auto text-pink-600"
                size={60}
              />

              <h3 className="text-xl font-semibold mt-4 text-center">
                Baby is the size of a Corn 🌽
              </h3>

              <p className="text-center mt-2 text-gray-600">
                Around 30 cm long and approximately 600 grams.
              </p>

            </CardContent>

          </Card>

          {/* Upcoming */}

          <Card>

            <CardHeader>

              <CardTitle>Upcoming Appointment</CardTitle>

            </CardHeader>

            <CardContent>

              <div className="flex items-center gap-3">

                <Stethoscope className="text-pink-600"/>

                <div>

                  <h4 className="font-semibold">
                    Dr. Priya Sharma
                  </h4>

                  <p className="text-gray-600">
                    30 July • 11:00 AM
                  </p>

                </div>

              </div>

            </CardContent>

          </Card>

          {/* Weekly Goals */}

          <Card className="lg:col-span-2">

            <CardHeader>

              <CardTitle>
                Weekly Goals
              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="grid md:grid-cols-4 gap-4">

                <Card>
                  <CardContent className="p-5 text-center">
                    💧
                    <h3 className="font-semibold mt-2">
                      Water
                    </h3>
                    <p>21 / 28 Litres</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 text-center">
                    🚶
                    <h3 className="font-semibold mt-2">
                      Walking
                    </h3>
                    <p>4 / 7 Days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 text-center">
                    🥗
                    <h3 className="font-semibold mt-2">
                      Healthy Meals
                    </h3>
                    <p>18 / 21 Meals</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5 text-center">
                    😊
                    <h3 className="font-semibold mt-2">
                      Mood
                    </h3>
                    <p>Happy</p>
                  </CardContent>
                </Card>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default WeeklySchedule;