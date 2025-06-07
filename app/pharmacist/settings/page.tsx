"use client"

import PharmacistSidebar from "@/components/pharmacist/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <PharmacistSidebar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-2 md:px-8 py-10 md:pl-64 transition-all duration-300">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span>Settings</span>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 rounded-xl overflow-hidden border bg-white dark:bg-gray-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <Card className="rounded-2xl shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" defaultValue="Experienced pharmacist with over 10 years in the field." />
                    </div>
                    <Button type="button" className="mt-2 w-full sm:w-auto">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card className="rounded-2xl shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Professional Information</CardTitle>
                  <CardDescription>Update your professional details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input id="license" defaultValue="PHR-12345-XYZ" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input id="education" defaultValue="Doctor of Pharmacy, University of Medical Sciences" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" defaultValue="Clinical Pharmacy" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" type="number" defaultValue="10" />
                    </div>
                    <Button type="button" className="mt-2 w-full sm:w-auto">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ACCOUNT TAB */}
          <TabsContent value="account">
            <Card className="rounded-2xl shadow">
              <CardHeader>
                <CardTitle className="text-xl">Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select id="language" className="w-full p-2 border rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="w-full p-2 border rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700">
                      <option value="utc">UTC</option>
                      <option value="est">Eastern Time (EST)</option>
                      <option value="cst">Central Time (CST)</option>
                      <option value="pst">Pacific Time (PST)</option>
                    </select>
                  </div>
                  <Button type="button" className="mt-2 w-full sm:w-auto">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <Card className="rounded-2xl shadow">
              <CardHeader>
                <CardTitle className="text-xl">Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: "Email Notifications", desc: "Receive notifications via email", checked: true },
                    { label: "SMS Notifications", desc: "Receive notifications via SMS", checked: false },
                    { label: "Browser Notifications", desc: "Receive notifications in your browser", checked: true },
                    { label: "Order Updates", desc: "Receive updates about orders", checked: true },
                    { label: "Inventory Alerts", desc: "Get notified about low inventory", checked: true },
                  ].map((item, idx) => (
                    <div className="flex items-center justify-between" key={item.label}>
                      <div>
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                  <Button type="button" className="mt-2 w-full sm:w-auto">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Change Password */}
              <Card className="rounded-2xl shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="button" className="mt-2 w-full sm:w-auto">Update Password</Button>
                  </form>
                </CardContent>
              </Card>

              {/* 2FA */}
              <Card className="rounded-2xl shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Secure your account with 2FA
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Recovery Codes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Generate recovery codes for emergency access
                        </p>
                      </div>
                      <Button variant="outline" disabled>
                        Generate Codes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
