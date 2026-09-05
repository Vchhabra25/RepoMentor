
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Phone, MessageCircle, AlertTriangle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FamilyAlerts = () => {
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [familyContacts, setFamilyContacts] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      relationship: "Husband",
      phone: "+91 98765 43210",
      email: "rajesh@email.com",
      priority: "Emergency"
    },
    {
      id: 2,
      name: "Sunita Devi",
      relationship: "Mother",
      phone: "+91 98765 43211",
      email: "sunita@email.com",
      priority: "High"
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      relationship: "Doctor",
      phone: "+91 98765 43212",
      email: "priya.doctor@email.com",
      priority: "Medical"
    },
    {
      id: 4,
      name: "Kavita Singh",
      relationship: "Sister",
      phone: "+91 98765 43213",
      email: "kavita@email.com",
      priority: "Medium"
    }
  ]);
  const { toast } = useToast();

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: familyContacts.length + 1,
        ...newContact,
        priority: "Medium"
      };
      setFamilyContacts([...familyContacts, contact]);
      setNewContact({ name: "", relationship: "", phone: "", email: "" });
      toast({
        title: "Contact Added",
        description: `${newContact.name} has been added to your family alerts`,
      });
    }
  };

  const sendAlert = (type: string) => {
    const message = alertMessage || `Emergency alert from Gestiva app. Please check on me.`;
    toast({
      title: `${type} Alert Sent`,
      description: `Alert sent to all ${type.toLowerCase()} contacts`,
    });
    setAlertMessage("");
  };

  const callContact = (contact: any) => {
    toast({
      title: "Calling",
      description: `Calling ${contact.name} at ${contact.phone}`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Emergency": return "bg-red-500";
      case "Medical": return "bg-blue-500";
      case "High": return "bg-orange-500";
      default: return "bg-gestiva-medium";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gestiva-light/20 to-gestiva-medium/30 p-6">
      <div 
        className="fixed inset-0 opacity-5 bg-contain bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/lovable-uploads/4b7c60ef-3ac8-4f9e-919a-6ebe93120366.png')`,
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="outline" className="mr-4 border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gestiva-darkest">Family Alerts</h1>
        </div>

        {/* Quick Alerts */}
        <div className="grid md:grid-cols-3 gap-4 mb-6 animate-fade-in">
          <Button
            onClick={() => sendAlert("Emergency")}
            className="bg-red-500 hover:bg-red-600 text-white py-8 text-lg"
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            Emergency Alert
          </Button>
          <Button
            onClick={() => sendAlert("Medical")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-8 text-lg"
          >
            <Heart className="w-6 h-6 mr-2" />
            Medical Alert
          </Button>
          <Button
            onClick={() => sendAlert("General")}
            className="bg-gestiva-medium hover:bg-gestiva-dark text-white py-8 text-lg"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            General Update
          </Button>
        </div>

        {/* Custom Message */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg mb-6 animate-fade-in">
          <CardHeader className="bg-gestiva-light/20">
            <CardTitle className="text-gestiva-darkest">Send Custom Alert</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="alertMessage" className="text-gestiva-darkest">Custom Message</Label>
                <Textarea
                  id="alertMessage"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="Type your custom alert message..."
                  rows={3}
                />
              </div>
              <Button
                onClick={() => sendAlert("Custom")}
                className="bg-gestiva-medium hover:bg-gestiva-dark text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Custom Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Family Contacts */}
        <div className="space-y-4 mb-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gestiva-darkest">Family Contacts</h2>
          
          {familyContacts.map((contact, index) => (
            <Card key={contact.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gestiva-light/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gestiva-medium" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gestiva-darkest">{contact.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(contact.priority)}`}>
                          {contact.priority}
                        </span>
                      </div>
                      <p className="text-gestiva-medium font-medium">{contact.relationship}</p>
                      <p className="text-gestiva-dark">{contact.phone}</p>
                      <p className="text-gestiva-dark text-sm">{contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => callContact(contact)}
                      variant="outline"
                      size="sm"
                      className="border-gestiva-medium text-gestiva-medium hover:bg-gestiva-medium hover:text-white"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Contact */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg animate-fade-in">
          <CardHeader className="bg-gestiva-light/20">
            <CardTitle className="text-gestiva-darkest">Add New Contact</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName" className="text-gestiva-darkest">Name</Label>
                <Input
                  id="contactName"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label htmlFor="relationship" className="text-gestiva-darkest">Relationship</Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="e.g., Spouse, Mother, Sister"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone" className="text-gestiva-darkest">Phone Number</Label>
                <Input
                  id="contactPhone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="+91 12345 67890"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-gestiva-darkest">Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 border-gestiva-light focus:border-gestiva-medium"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <Button onClick={addContact} className="bg-gestiva-medium hover:bg-gestiva-dark text-white mt-4">
              Add Contact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyAlerts;
