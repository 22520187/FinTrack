import { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit, LogOut, Check } from 'lucide-react';
import fintrackLogo from '../../assets/fintrack.jpg';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';
import authService from '../../services/auth.service';

// Component trang cài đặt cho phép cập nhật profile và đổi mật khẩu
const Settings = () => {
  const { toast } = useToast();

  const apiKey = "a84f0896-7c1a-11ef-8e53-0a00184fe694";

  const [userProfile, setUserProfile] = useState({
    userId: 0,
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    ward: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...userProfile});

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Load thông tin user khi component mount
  useEffect(() => {
    const userData = authService.getCurrentUser();
    
    if (userData) {
      setUserProfile(userData);
      setEditedProfile(userData);
    } else {
      window.location.href = '/login';
    }
    
    setIsLoading(false);
  }, []);

  // Load danh sách tỉnh/thành phố từ API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cities",
        });
      }
    };

    fetchCities();
  }, []);

  // Load danh sách quận/huyện khi thay đổi tỉnh/thành phố
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!editedProfile.city) {
        setDistricts([]);
        setWards([]);
        return;
      }

      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
            body: JSON.stringify({
              province_id: parseInt(editedProfile.city),
            }),
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setDistricts(data.data);
          setEditedProfile(prev => ({ ...prev, district: '', ward: '' }));
          setWards([]);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load districts",
        });
      }
    };

    if (isEditing) {
      fetchDistricts();
    }
  }, [editedProfile.city, isEditing]);

  // Load danh sách phường/xã khi thay đổi quận/huyện
  useEffect(() => {
    const fetchWards = async () => {
      if (!editedProfile.district) {
        setWards([]);
        return;
      }

      try {
        const response = await fetch(
          "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Token: apiKey,
            },
            body: JSON.stringify({
              district_id: parseInt(editedProfile.district),
            }),
          }
        );
        const data = await response.json();

        if (data && data.data) {
          setWards(data.data);
          setEditedProfile(prev => ({ ...prev, ward: '' }));
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load wards",
        });
      }
    };

    if (isEditing) {
      fetchWards();
    }
  }, [editedProfile.district, isEditing]);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  // Xử lý thay đổi thông tin profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cập nhật thông tin profile
  const handleProfileUpdate = async () => {
    setIsProfileUpdating(true);

    try {
      const updateData = {
        fullName: editedProfile.fullName,
        phone: editedProfile.phone,
        city: cities.find(city => city.ProvinceID.toString() === editedProfile.city)?.ProvinceName || editedProfile.city,
        district: districts.find(district => district.DistrictID.toString() === editedProfile.district)?.DistrictName || editedProfile.district,
        ward: wards.find(ward => ward.WardCode === editedProfile.ward)?.WardName || editedProfile.ward
      };

      const response = await authService.updateUserInfo(userProfile.userId, updateData);

      if (response.status !== 200) {
        throw new Error("Failed to update profile");
      }

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

      const response = await authService.forgetPassword(changePasswordData);

      if (response.status !== 200) {
        throw new Error("Failed to change password");
      }

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

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
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-500">
                <img 
                  src={fintrackLogo} 
                  alt="FinTrack Avatar" 
                  className="w-full h-full object-cover"
                />
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
                    <Select
                      value={editedProfile.city}
                      onValueChange={(value) => {
                        setEditedProfile(prev => ({ 
                          ...prev, 
                          city: value,
                          district: '',
                          ward: ''
                        }));
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.ProvinceID} value={city.ProvinceID.toString()}>
                            {city.ProvinceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">District</label>
                    <Select
                      value={editedProfile.district}
                      onValueChange={(value) => {
                        setEditedProfile(prev => ({ 
                          ...prev, 
                          district: value,
                          ward: ''
                        }));
                      }}
                      disabled={!editedProfile.city}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.DistrictID} value={district.DistrictID.toString()}>
                            {district.DistrictName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ward</label>
                    <Select
                      value={editedProfile.ward}
                      onValueChange={(value) => {
                        setEditedProfile(prev => ({ 
                          ...prev, 
                          ward: value
                        }));
                      }}
                      disabled={!editedProfile.district}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <p className="font-medium">
                      {cities.find(city => city.ProvinceID.toString() === userProfile.city)?.ProvinceName || userProfile.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">District</p>
                    <p className="font-medium">
                      {districts.find(district => district.DistrictID.toString() === userProfile.district)?.DistrictName || userProfile.district}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ward</p>
                    <p className="font-medium">
                      {wards.find(ward => ward.WardCode === userProfile.ward)?.WardName || userProfile.ward}
                    </p>
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
                    // Handle logout
                    authService.logout();
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
