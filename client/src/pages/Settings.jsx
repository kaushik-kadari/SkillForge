import { useState, useEffect } from "react"
import { User, Mail, Lock, Camera, CheckCircle2, AlertCircle } from "lucide-react"
import { useAuth } from "../services/AuthService"
import { updateUser, updatePassword } from "../services/contentService"
import { toast } from "react-toastify"
import { FallingLines } from "react-loader-spinner"

export default function Settings() {
  const { user, setUser, loading } = useAuth()
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    const newEmail = formData.email !== user.email ? formData.email : ""
    const response = await updateUser(user.email, newEmail, formData.name)
    setIsEditing(false)
    if(response.status === false) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        name: user.name,
      }))
      toast.error(response.message)
    }
    else {
      toast.success("Profile updated successfully!")
      setUser(response.user)
      localStorage.setItem("name", response.user.name);
      localStorage.setItem("email", response.user.email);
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!")
      return
    }
   
    const response = await updatePassword(user.email, formData.currentPassword, formData.newPassword)
    // console.log(response)
    setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }))
    if(response.status === true) toast.success(response.message)
    else toast.error(response.message)
  }

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
    }))
  }, [user])

  if(loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-h-[60vh]">
      <FallingLines
        color="black"
        width="150"
        visible={true}
        ariaLabel="falling-circles-loading"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>

        {/* Notification Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {errorMessage}
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
           
            {/* Name Input */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2  focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-600 transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

