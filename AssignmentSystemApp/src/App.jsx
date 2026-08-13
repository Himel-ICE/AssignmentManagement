import './App.css'
import Login from './Views/Pages/Auth/Login'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './Views/shared/Layouts/MainLayout'
import Dashboard from './Views/Pages/Dashboard/Dashboard'
import Class from './Views/Pages/Academic/Class'
import Subject from './Views/Pages/Academic/Subject'
import Teacher from './Views/Pages/Academic/Teacher'
import Student from './Views/Pages/Academic/Student'
import MyClasses from './Views/Pages/Academic/MyClasses'
import Assignment from './Views/Pages/Assignment/Assignment'
import Submission from './Views/Pages/Assignment/Submission'
import Users from './Views/Pages/Administration/Users'
import ClassSetting from './Views/Pages/Administration/ClassSetting'
import Reports from './Views/Pages/Reports/Reports'
import Settings from './Views/Pages/Settings/Settings'

function App() {

  return (
    <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route element={<ProtectedRoute roles={["admin"]} />}>
                        <Route path="/class" element={<Class />} />
                        <Route path="/subject" element={<Subject />} />
                    </Route>
                    <Route path="/teacher" element={<Teacher />} />
                    <Route path="/student" element={<Student />} />
                    <Route path="/my-classes" element={<MyClasses />} />
                    <Route path="/assignment" element={<Assignment />} />
                    <Route path="/submission" element={<Submission />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/class-setting" element={<ClassSetting />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route>
    </Routes>
  )
}

export default App
