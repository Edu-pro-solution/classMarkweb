
export const navigations = [
  {
    name: "Dashboard",
    path: "/dashboard/admin",
    icon: <span style={{ color: "#ffc107" }}>dashboard</span>,
  },
  {
    name: "Admin",
    path: "/admin/admin",
    icon: <span style={{ color: "#ffc107" }}>person</span>,
  },
  {
    name: "Student",
    icon: "people",
    children: [
      {
        name: "Admit Student",
        iconText: "SI",
        path: "/dashboard/student_add",
      },
      {
        name: "Student Information",
        iconText: "SU",
        children: [
          {
            name: "Class J.S.1 ",
            iconText: "SI",
            path: "/dashboard/jss1-student_information",
          },
          {
            name: "Class J.S.2",
            iconText: "SI",
            path: "/dashboard/jss2-student_information",
          },
          {
            name: "Class J.S.3",
            iconText: "SI",
            path: "/dashboard/jss3-student_information",
          },

          {
            name: "Class S.S.1.S",
            iconText: "SI",
            path: "/dashboard/ss1-science-student_information",
          },
          {
            name: "Class S.S.1.A",
            iconText: "SI",
            path: "/dashboard/ss1-art-student_information",
          },
          {
            name: "Class S.S.1.C",
            iconText: "SI",
            path: "/dashboard/ss1-commercial-student_information",
          },
          {
            name: "Class S.S.2.S",
            iconText: "SI",
            path: "/dashboard/ss2-science-student_information",
          },
          {
            name: "Class S.S.2.A",
            iconText: "SI",
            path: "/dashboard/ss2-art-student_information",
          },
          {
            name: "Class S.S.2.C",
            iconText: "SI",
            path: "/dashboard/ss2-commercial-student_information",
          },
          {
            name: "Class S.S.3.S",
            iconText: "SI",
            path: "/dashboard/ss3-science-student_information",
          },
          {
            name: "Class S.S.3.A",
            iconText: "SI",
            path: "/dashboard/ss3-art-student_information",
          },
          {
            name: "Class S.S.3.C",
            iconText: "SI",
            path: "/dashboard/ss3-commercial-student_information",
          },
        ],
      },
      {
        name: "Student Promotion",
        iconText: "404",
        path: "/dashboard/promotion",
      },
    ],
  },
  {
    name: "Affective Psychomotor",
    icon: "person",
    children: [
      {
        name: "Manage Category",
        iconText: "SI",
        path: "/dashboard/psychomotor_report_cat",
      },
      {
        name: "Manage Student Report",
        iconText: "SI",
        path: "/dashboard/manage_psychomotor",
      },
    ],
  },
  {
    name: "Teacher",
    path: "/dashboard/teacher",
    icon: <span style={{ color: "#ffc107" }}>person</span>,
  },

  {
    name: "Subject",
    icon: "book",
    children: [
      {
        name: "Class J.S.S 1",
        iconText: "SI",
        path: "/dashboard/js1-subject",
      },
      {
        name: "Class J.S.S 2",
        iconText: "SI",
        path: "/dashboard/js2-subject",
      },
      {
        name: "Class J.S.S 3",
        iconText: "SI",
        path: "/dashboard/js3-subject",
      },
      {
        name: "Class S.S.1.S",
        iconText: "SI",
        path: "/dashboard/ss1-science-subject",
      },
      {
        name: "Class S.S.1.A",
        iconText: "SI",
        path: "/dashboard/ss1-art-subject",
      },
      {
        name: "Class S.S.1.C",
        iconText: "SI",
        path: "/dashboard/ss1-commercial-subject",
      },
      {
        name: "Class S.S.1.T",
        iconText: "SI",
        path: "/dashboard/ss1-technology-subject",
      },
      {
        name: "Class S.S.2.S",
        iconText: "SI",
        path: "/dashboard/ss2-science-subject",
      },
      {
        name: "Class S.S.2.A",
        iconText: "SI",
        path: "/dashboard/ss2-art-subject",
      },
      {
        name: "Class S.S.2.C",
        iconText: "SI",
        path: "/dashboard/ss2-commercial-subject",
      },
      {
        name: "Class S.S.3.S",
        iconText: "SI",
        path: "/dashboard/ss3-science-subject",
      },
      {
        name: "Class S.S.3.A",
        iconText: "SI",
        path: "/dashboard/ss3-art-subject",
      },
      {
        name: "Class S.S.3.C",
        iconText: "SI",
        path: "/dashboard/ss3-commercial-subject",
      },
      {
        name: "JAMB",
        iconText: "SI",
        path: "/dashboard/jamb",
      },
      {
        name: "WAEC",
        iconText: "SI",
        path: "/dashboard/waec",
      },
    ],
  },
  {
    name: "Noticeboard",
    icon: <span style={{ color: "#ffc107" }}>info</span>,
    path: "/dashboard/noticeboard",
  },
  {
    name: "Parents",
    path: "/dashboard/parent",
    icon: <span style={{ color: "#ffc107" }}>person</span>,
  },
  {
    name: "Class",
    icon: "school",
    children: [
      {
        name: "Manage Class",
        iconText: "SI",
        path: "/dashboard/class",
      },
      {
        name: "Academic Syllabus",
        iconText: "SI",
        path: "/dashboard/syllabus",
      },
    ],
  },
  {
    name: "Exam",
    icon: "assignment",
    children: [
      {
        name: "Exam List",
        iconText: "SI",
        path: "/dashboard/examlist",
      },
      {
        name: "Exam Grades",
        iconText: "SI",
        path: "/dashboard/grade",
      },
      {
        name: "Manage Marks",
        iconText: "SI",
        path: "/dashboard/exam",
      },
      {
        name: "On-Screen Marking",
        iconText: "SI",
        path: "/dashboard/onscreen-marking",
      },
      {
        name: "Tabulation Sheet",
        iconText: "SI",
        path: "/dashboard/tabulation-sheet",
      },
    ],
  },
  {
    name: "Online Exam",
    icon: "computer",
    children: [
      {
        name: "Create Online Exam",
        iconText: "SI",
        path: "/dashboard/online-exam",
      },
      {
        name: "Manage Online Exam",
        iconText: "SI",
        path: "/dashboard/manage-online-exam",
      },
    ],
  },
  {
    name: "Curriculum",
    icon: <span style={{ color: "#ffc107" }}>group_work</span>,
    children: [
      {
        name: "Curriculum Generator",
        iconText: "SI",
        path: "/dashboard/curriculum",
      },
    ],
  },
  {
    name: "Questions",
    icon: "assignment",
    children: [
      {
        name: "Generate Questions",
        iconText: "SI",
        path: "/dashboard/generate-question",
      },
    ],
  },
  {
    name: "Past Questions",
    icon: "assignment",
    children: [
      {
        name: "Create UTME Questions",
        iconText: "SI",
        path: "/dashboard/create-utme-question",
      },
      {
        name: "JAMB(UTME)",
        iconText: "SI",
        path: "/dashboard/jamb-past-question",
      },
      {
        name: "WAEC",
        iconText: "SI",
        path: "/dashboard/waec-past-question",
      },
    ],
  },
  {
    name: "Accounting",
    icon: "payment",
    children: [
      {
        name: "Create Student Receipt",
        iconText: "SI",
        path: "/dashboard/student-receipt",
      },
      {
        name: "Student Payments",
        iconText: "SI",
        path: "/dashboard/student-payment",
      },
    ],
  },
  {
    name: "Study Material",
    path: "/dashboard/study-material",
    icon: <span style={{ color: "#ffc107" }}>group_work</span>,
  },
  {
    name: "Daily Attendance",
    path: "/dashboard/attendance",
    icon: <span style={{ color: "#ffc107" }}>access_alarm</span>,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: <span style={{ color: "#ffc107" }}>person</span>,
  },
  {
    name: "Setting",
    path: "/dashboard/setting",
    icon: <span style={{ color: "#ffc107" }}>settings</span>,
  },
  {
    name: "Account",
    path: "/dashboard/account",
    icon: <span style={{ color: "#ffc107" }}>edit</span>,
  },
];
