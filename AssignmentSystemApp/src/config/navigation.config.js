import {
    RiDashboardLine,
    RiBookOpenLine,
    RiFileList3Line,
    RiUserSettingsLine,
    RiGraduationCapLine,
    RiBook2Line,
    RiBookmarkLine,
    RiShieldUserLine,
    RiTeamLine,
} from "react-icons/ri";

export const navigation = [
    {
        id: "dashboard",
        title: "Dashboard",
        icon: RiDashboardLine,
        path: "/",
    },

    {
        id: "academic",
        title: "Academic",
        icon: RiBookOpenLine,
        children: [
            {
                id: "my-classes",
                title: "My Classes",
                icon: RiBookmarkLine,
                path: "/my-classes",
                roles: ["teacher"],
            },
            {
                id: "class",
                title: "Classes",
                icon: RiGraduationCapLine,
                path: "/class",
                roles: ["admin"],
            },
            {
                id: "subject",
                title: "Subjects",
                icon: RiBook2Line,
                path: "/subject",
                roles: ["admin"],
            },
        ],
    },

    {
        id: "assignment",
        title: "Assignment",
        icon: RiFileList3Line,
        children: [
            {
                id: "assignment-list",
                title: "Assignment",
                path: "/assignment",
            },
            {
                id: "submission",
                title: "Submission",
                path: "/submission",
            },
        ],
    },

    {
        id: "administration",
        title: "Administration",
        icon: RiUserSettingsLine,
        children: [
            {
                id: "users",
                title: "Users",
                icon: RiTeamLine,
                path: "/users",
                roles: ["admin"],
            },
            {
                id: "class-setting",
                title: "Class Setting",
                icon: RiShieldUserLine,
                path: "/class-setting",
                roles: ["admin"],
            },
        ],
    },

];