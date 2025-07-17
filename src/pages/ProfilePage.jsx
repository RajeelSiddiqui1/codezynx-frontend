import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../lib/api";
import {
  CalendarIcon,
  Edit3Icon,
  ShuffleIcon,
} from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import SkillSelector from "../components/SkillSelector";
import { LANGUAGES } from "../constants";
import toast, { Toaster } from "react-hot-toast";

const ProfilePage = () => {
  const { authUser: user, isLoading } = useAuthUser();
  const [showSkillModal, setShowSkillModal] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    dateOfBirth: "",
    skills: [],
    profilePic: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        bio: user.bio || "",
        nativeLanguage: user.nativeLanguage || "",
        learningLanguage: user.learningLanguage || "",
        location: user.location || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
        skills: user.skills || [],
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => toast.success("Profile updated successfully"),
    onError: () => toast.error("Failed to update profile"),
  });

  const { mutate: removeSkillMutation } = useMutation({
    mutationFn: (updatedSkills) => updateUserProfile({ skills: updatedSkills }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(profile);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const avatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setProfile((prev) => ({ ...prev, profilePic: avatar }));
    toast.success("Random profile picture generated!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
    
      <div className="w-full max-w-4xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Edit3Icon className="size-6" />
          Edit Profile
        </h2>

        <div className="flex justify-center relative">
          <div className="size-32 rounded-full overflow-hidden bg-base-300">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-sm opacity-60">
                No Picture
              </div>
            )}
          </div>
          <button
            onClick={handleRandomAvatar}
            className="btn btn-xs btn-accent absolute bottom-0 right-0"
          >
            <ShuffleIcon className="size-3 mr-1" />
            Generate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label">Email</label>
              <input
                type="email"
                className="input input-bordered"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-control">
              <label className="label">Native Language</label>
              <select
                name="nativeLanguage"
                className="select select-bordered"
                value={profile.nativeLanguage}
                onChange={handleChange}
              >
                <option value="">Select Native Language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">Opponent Language</label>
              <select
                name="learningLanguage"
                className="select select-bordered"
                value={profile.learningLanguage}
                onChange={handleChange}
              >
                <option value="">Select Opponent Language</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">Location</label>
              <input
                type="text"
                className="input input-bordered"
                name="location"
                value={profile.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <label className="label flex items-center gap-2">
                <CalendarIcon className="size-4" />
                Date of Birth
              </label>
              <input
                type="date"
                className="input input-bordered"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">Bio</label>
            <textarea
              name="bio"
              className="textarea textarea-bordered"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-control space-y-2">
            <label className="label">Skills</label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="badge badge-outline hover:line-through cursor-pointer"
                  onClick={() => {
                    const updatedSkills = profile.skills.filter((s) => s !== skill);
                    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
                    removeSkillMutation(updatedSkills);
                  }}
                >
                  {skill}
                </span>
              ))}
              <button
                type="button"
                onClick={() => setShowSkillModal(true)}
                className="btn btn-sm btn-outline"
              >
                + Add Skill
              </button>
            </div>
          </div>

          {showSkillModal && (
            <SkillSelector
              selectedSkills={profile.skills}
              onAddSkill={(skill) => {
                const updated = [...new Set([...profile.skills, skill])];
                setProfile((prev) => ({ ...prev, skills: updated }));
                updateProfileMutation({ ...profile, skills: updated });
                setShowSkillModal(false);
              }}
              onClose={() => setShowSkillModal(false)}
            />
          )}

          <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isPending}>
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
