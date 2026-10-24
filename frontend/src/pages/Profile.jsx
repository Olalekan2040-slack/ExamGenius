import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import LoadingOverlay from '../components/LoadingOverlay'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getProfile, updateProfile, uploadAvatar } from '../api'
import { getUserInitials } from '../utils'

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
]

export default function Profile() {
  const { user, logout } = useAuth()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
    class_level: '',
    gender: '',
    age: '',
    department: '',
    state: '',
    local_government: '',
  })
  const [editLoading, setEditLoading] = useState(false)
  const avatarFileRef = useRef(null)

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadProfile() {
    setLoading(true)
    try {
      const data = await getProfile()
      setProfileData(data)
    } catch (err) {
      addToast('Failed to load profile: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  function openEditModal() {
    if (!profileData) return
    setEditForm({
      full_name: profileData.full_name || profileData.name || '',
      phone_number: profileData.phone_number || '',
      class_level: profileData.class_level || '',
      gender: profileData.gender || '',
      age: profileData.age ? String(profileData.age) : '',
      department: profileData.department || '',
      state: profileData.state || '',
      local_government: profileData.local_government || '',
    })
    setShowEditModal(true)
  }

  function handleEditChange(e) {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()

    const fullName = editForm.full_name.trim()
    const classLevel = editForm.class_level

    if (fullName.length < 3) {
      addToast('Name must be at least 3 characters', 'warning')
      return
    }
    if (!classLevel) {
      addToast('Please select your class level', 'warning')
      return
    }

    setEditLoading(true)
    try {
      const updateData = {
        full_name: fullName,
        class_level: classLevel,
      }
      if (editForm.phone_number) updateData.phone_number = editForm.phone_number
      if (editForm.gender) updateData.gender = editForm.gender
      if (editForm.age) updateData.age = parseInt(editForm.age)
      if (editForm.department) updateData.department = editForm.department
      if (editForm.state) updateData.state = editForm.state
      if (editForm.local_government) updateData.local_government = editForm.local_government

      await updateProfile(updateData)
      setShowEditModal(false)
      addToast('Profile updated successfully!', 'success')
      await loadProfile()
    } catch (err) {
      addToast('Failed to update profile: ' + err.message, 'error')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleUploadAvatar() {
    const file = avatarFileRef.current?.files?.[0]
    if (!file) {
      addToast('Please select an image to upload', 'warning')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast('Image must be less than 2MB', 'warning')
      return
    }
    setEditLoading(true)
    try {
      await uploadAvatar(file)
      addToast('Profile picture updated!', 'success')
      setShowEditModal(false)
      await loadProfile()
    } catch (err) {
      addToast('Failed to upload picture: ' + err.message, 'error')
    } finally {
      setEditLoading(false)
    }
  }

  function handleLogout() {
    logout()
  }

  if (loading) return <LoadingOverlay message="Loading profile..." />

  if (!profileData) return null

  return (
    <Layout>
      <div className="profile-screen">
        <h1>
          <i className="fas fa-user"></i> My Profile
        </h1>

        {/* ── Profile Card ── */}
        <div className="card mt-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
              {getUserInitials(profileData.name)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ marginBottom: '4px' }}>{profileData.full_name || profileData.name}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{profileData.email}</p>
              {profileData.class_level && (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-graduation-cap"></i> {profileData.class_level} Student
                </p>
              )}
            </div>
            <button className="btn btn-outline" onClick={openEditModal}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          </div>

          {/* Profile Detail Fields */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-color)',
            }}
          >
            <ProfileField label="Phone" value={profileData.phone_number || 'Not set'} icon="fa-phone" />
            <ProfileField label="Gender" value={profileData.gender || 'Not set'} icon="fa-venus-mars" />
            <ProfileField
              label="Age"
              value={profileData.age ? `${profileData.age} years` : 'Not set'}
              icon="fa-birthday-cake"
            />
            <ProfileField
              label="Department"
              value={profileData.department || 'Not set'}
              icon="fa-book-reader"
            />
            <ProfileField
              label="State"
              value={profileData.state || 'Not set'}
              icon="fa-map-marker-alt"
            />
            <ProfileField
              label="LGA"
              value={profileData.local_government || 'Not set'}
              icon="fa-map-pin"
            />
          </div>
        </div>

        {/* ── Performance Statistics ── */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>
              <i className="fas fa-chart-bar"></i> Performance Statistics
            </h2>
          </div>
          <div className="stats-grid">
            {/* Total Attempts */}
            <div className="stat-card" style={{ borderLeft: '4px solid var(--info)' }}>
              <i className="fas fa-question-circle" style={{ color: 'var(--info)' }}></i>
              <div>
                <p className="stat-label">Total Attempts</p>
                <p className="stat-value">{profileData.stats.total_attempts}</p>
              </div>
            </div>
            {/* Correct Answers */}
            <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
              <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>
              <div>
                <p className="stat-label">Correct Answers</p>
                <p className="stat-value">{profileData.stats.correct_attempts}</p>
              </div>
            </div>
            {/* Accuracy */}
            <div className="stat-card" style={{ borderLeft: '4px solid var(--primary-yellow-dark)' }}>
              <i className="fas fa-bullseye" style={{ color: 'var(--primary-yellow-dark)' }}></i>
              <div>
                <p className="stat-label">Accuracy</p>
                <p className="stat-value">{profileData.stats.accuracy.toFixed(1)}%</p>
              </div>
            </div>
            {/* Streak */}
            <div className="stat-card" style={{ borderLeft: '4px solid var(--error)' }}>
              <i className="fas fa-fire" style={{ color: 'var(--error)' }}></i>
              <div>
                <p className="stat-label">Current Streak</p>
                <p className="stat-value">{profileData.stats.current_streak} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── My Subjects ── */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>
              <i className="fas fa-book"></i> My Subjects
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {profileData.subjects.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 600 }}>{s.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Account Settings ── */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>
              <i className="fas fa-cog"></i> Account Settings
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setShowPasswordModal(true)}>
              <i className="fas fa-key"></i> Change Password
            </button>
            <button
              className="btn btn-outline"
              onClick={handleLogout}
              style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === 'modal-overlay') setShowEditModal(false)
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="full_name"
                    value={editForm.full_name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-avatar">Profile Picture</label>
                  <input
                    type="file"
                    id="edit-avatar"
                    accept="image/*"
                    ref={avatarFileRef}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: '8px' }}
                    onClick={handleUploadAvatar}
                    disabled={editLoading}
                  >
                    <i className="fas fa-upload"></i> Upload Picture
                  </button>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone_number"
                    value={editForm.phone_number}
                    onChange={handleEditChange}
                    placeholder="08012345678"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-class">Class Level</label>
                  <select
                    id="edit-class"
                    name="class_level"
                    value={editForm.class_level}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="SS1">SS1</option>
                    <option value="SS2">SS2</option>
                    <option value="SS3">SS3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-gender">Gender</label>
                  <select
                    id="edit-gender"
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-age">Age</label>
                  <input
                    type="number"
                    id="edit-age"
                    name="age"
                    value={editForm.age}
                    onChange={handleEditChange}
                    min="10"
                    max="100"
                    placeholder="Enter your age"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-department">Department</label>
                  <select
                    id="edit-department"
                    name="department"
                    value={editForm.department}
                    onChange={handleEditChange}
                  >
                    <option value="">Select Department</option>
                    <option value="Science">Science</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Art">Art</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-state">State</label>
                  <select
                    id="edit-state"
                    name="state"
                    value={editForm.state}
                    onChange={handleEditChange}
                  >
                    <option value="">Select State</option>
                    {NIGERIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-lga">Local Government Area</label>
                  <input
                    type="text"
                    id="edit-lga"
                    name="local_government"
                    value={editForm.local_government}
                    onChange={handleEditChange}
                    placeholder={editForm.state ? `Enter LGA in ${editForm.state}` : 'Enter LGA'}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={editLoading}
                >
                  <i className="fas fa-save"></i>{' '}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === 'modal-overlay') setShowPasswordModal(false)
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="close-modal" onClick={() => setShowPasswordModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                To change your password, please use the &ldquo;Forgot Password&rdquo; option on the
                login page.
              </p>
              <button
                className="btn btn-primary btn-block"
                onClick={() => setShowPasswordModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

// ── Helper sub-component ──────────────────────────────────────────────────────
function ProfileField({ label, value, icon }) {
  return (
    <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
        <i className={`fas ${icon}`}></i> {label}
      </p>
      <p style={{ fontWeight: 600 }}>{value}</p>
    </div>
  )
}
