import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    bloodGroup: "",
    due_date: "",
    height: "",
    weight: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();

    if (response.ok) {
      toast({
        title: "Success 🎉",
        description: data.message,
      });
    } else {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error(error);

    toast({
      title: "Server Error",
      description: "Cannot connect to Flask backend.",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen bg-pink-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Complete Your Profile
        </h1>

        <div className="space-y-4">

          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Age</Label>
            <Input
              name="age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Blood Group</Label>
            <Input
              name="bloodGroup"
              value={profile.bloodGroup}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Due Date</Label>
            <Input
              name="due_date"
              value={profile.due_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Height (cm)</Label>
            <Input
              name="height"
              value={profile.height}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Weight (kg)</Label>
            <Input
              name="weight"
              value={profile.weight}
              onChange={handleChange}
            />
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleSave}
          >
            Save Profile
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Profile;