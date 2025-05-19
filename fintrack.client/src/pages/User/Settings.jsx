import { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit, LogOut, Check } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';
import authService from '../../services/auth.service';

const Settings = () => {
  const { toast } = useToast();

  // User profile state
  const [userProfile, setUserProfile] = useState({
    userId: 0,
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    ward: ''
  });

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...userProfile});

  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    // In a real application, you would fetch the user data from the server
    // For now, we'll use mock data
    // This would be replaced with an API call to get the current user's profile

    // Mock user data for demonstration
    const userData = {
      userId: 1,
      fullName: 'Khanh Dang',
      email: '22520187@gm.uit.edu.vn',
      phone: '123456789',
      city: 'An Giang',
      district: 'Huyện Chợ Mới',
      ward: 'Xã Nhơn Mỹ'
    };

    setUserProfile(userData);
    setEditedProfile(userData);
    setIsLoading(false);
  }, []);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Show/hide password toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading states
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsProfileUpdating(true);

    try {
      // Call the API to update the user profile
      const response = await authService.updateUserInfo(editedProfile);

      if (response.status !== 200) {
        throw new Error("Failed to update profile");
      }

      // Update local state with the response data
      const updatedUser = response.data.user;
      setUserProfile(updatedUser);
      setIsEditing(false);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your profile.",
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "New password and confirmation password must match.",
      });
      return;
    }

    setIsPasswordUpdating(true);

    try {
      // Prepare data for API call
      const changePasswordData = {
        email: userProfile.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      // Call the API to change the password
      const response = await authService.forgetPassword(changePasswordData);

      if (response.status !== 200) {
        throw new Error("Failed to change password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.response?.data?.message || "There was a problem updating your password.",
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6 text-left">USER PROFILE</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading profile information...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl">
                Profile
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-left">
              {isEditing ? (
                // Editing mode - show input fields
                <>
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <Input
                      name="fullName"
                      value={editedProfile.fullName}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone Number</label>
                    <Input
                      name="phone"
                      value={editedProfile.phone}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">City</label>
                    <Input
                      name="city"
                      value={editedProfile.city}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">District</label>
                    <Input
                      name="district"
                      value={editedProfile.district}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ward</label>
                    <Input
                      name="ward"
                      value={editedProfile.ward}
                      onChange={handleProfileChange}
                      className="mt-1"
                    />
                  </div>
                </>
              ) : (
                // View mode - show text
                <>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userProfile.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{userProfile.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{userProfile.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">District</p>
                    <p className="font-medium">{userProfile.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ward</p>
                    <p className="font-medium">{userProfile.ward}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            {isEditing ? (
              <>
                <Button
                  variant="default"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleProfileUpdate}
                  disabled={isProfileUpdating}
                >
                  {isProfileUpdating ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check size={16} />
                      SAVE CHANGES
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    // Reset edited profile and exit editing mode
                    setEditedProfile({...userProfile});
                    setIsEditing(false);
                  }}
                  disabled={isProfileUpdating}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedProfile({...userProfile});
                  }}
                >
                  <Edit size={16} />
                  EDIT PROFILE
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50 cursor-pointer"
                  onClick={() => {
                    // Here you would handle logout
                    toast({
                      title: "Logging out",
                      description: "You have been logged out successfully.",
                    });
                    // Redirect to login page
                    // window.location.href = '/login';
                  }}
                >
                  <LogOut size={16} />
                  LOG OUT
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-primary-500">CHANGE PASSWORD</CardTitle>
          </CardHeader>
          <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-6 text-left">
              <div>
                <label className="text-sm text-gray-500 block mb-2" htmlFor="currentPassword">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="8+ characters"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="8+ characters"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                type="submit"
                disabled={isPasswordUpdating}
                className="bg-primary-500 text-white cursor-pointer"
              >
                {isPasswordUpdating ? "UPDATING..." : "CHANGE PASSWORD"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      )}
    </div>
  );
};

export default Settings;
