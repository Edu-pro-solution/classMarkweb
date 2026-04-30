import Loadable from "../../../app/components/Loadable";
import { lazy } from "react";
import { authRoles } from "../../auth/authRoles";
import Admin from "./admin/Admin";
import Class from "./forms/Class";
import Examlist from "./forms/Examlist";
import Exam from "./forms/Exam";
import Form from "./forms/Form";
import Grade from "./forms/Grade";
import Info from "./forms/Info";
import Info2 from "./forms/Info2";
import Manage from "./forms/Manage";
import Online from "./forms/Online";
import Payment from "./forms/Payment";
import Profile from "./forms/Profile";
import Sub1 from "./forms/Sub1";
import Sub2 from "./forms/Sub2";
import Sub3 from "./forms/Sub3";
import Subject from "./forms/Subject";
import Tab from "./forms/Tab";
import Teacher from "./forms/Teacher";
import ManagemarkView from "./forms/ManagemarkView";
import Info3 from "./forms/Info3";
import Info4 from "./forms/Info4";
import Info5 from "./forms/Info5";
import Info6 from "./forms/Info6";
import Sub4 from "./forms/Sub4";
import Sub5 from "./forms/Sub5";
import Sub6 from "./forms/Sub6";
import AddClass from "./forms/AddClass";
import ManSin from "./forms/ManSin";

import ViewResult from "./forms/ViewResult";
import MarkSheet from "./forms/MarkSheet";
import ReportCard from "./forms/ReportCard";
import ViewAdmin from "./admin/ViewAdmin";

import TermRepCont from "./forms/TermRepCont";

import StuReceipt from "./forms/StuReceipt";

import { ReceiptProvider } from "./forms/receiptContext";
import NoticeBoard from "./forms/NoticeBoard";
import ViewNotice from "./forms/ViewNotice";
import Parent from "./forms/Parent";
import Setting from "./forms/Settings";
import Account from "./forms/Account";
import Info7 from "./forms/Info7";

import Info9 from "./forms/Info9";
import Info8 from "./forms/Info8";
import Info10 from "./forms/Info10";
import Info11 from "./forms/Info11";
import Info12 from "./forms/Info12";
import ManagePsy from "./forms/ManagePsy";
import Sub7 from "./forms/Sub7";
import Sub8 from "./forms/Sub8";
import Sub9 from "./forms/Sub9";
import Sub10 from "./forms/Sub10";
import Sub11 from "./forms/Sub11";
import Sub12 from "./forms/Sub12";
import StudyMat from "./forms/StudyMat";
import Attendance from "./admin/Attendance";
import Promotion from "./forms/Promotion";
import PsyCat from "./forms/PsyCat";
import OnScreen from "./forms/OnScreen";
import Screen from "./forms/Screen";
import OnOff from "./forms/OnOff";
import Info13 from "./forms/Info13";
import Sub14 from "./forms/Sub14";
import ViewReceipt from "./forms/ViewReceipt";
import FirstTermRepCont from "./forms/FirstTermRepCont";
import ThirdTermRepCont from "./forms/ThirdTermRepCont";
import Syllabus from "./forms/Syllabus";
import PQ from "./forms/PQ";
import Curriculum from "./forms/Curriculum";
import Jamb from "./forms/Jamb";
import Waec from "./forms/Waec";
import CreateJamb from "./forms/CreateJamb";
import ManageJamb from "./forms/ManageJamb";
import JambSingle from "./forms/JambSingle";
import BulkPrintClass from "./forms/BulkPrintClass";
// import Js1b from "./forms/Js1b";

const Analytics = Loadable(lazy(() => import("./Analytics")));

const adminDashboardRoutes = [
  { path: "/dashboard/admin", element: <Admin />, auth: "admin" },
  { path: "/admin/admin", element: <ViewAdmin />, auth: "admin" },
  { path: "/dashboard/student_add", element: <Form />, auth: "admin" },
  { path: "/dashboard/classes", element: <AddClass />, auth: "admin" },
  { path: "/dashboard/js1-subject", element: <Sub1 />, auth: "admin" },
  { path: "/dashboard/examlist", element: <Examlist />, auth: "admin" },
  { path: "/dashboard/js3-subject", element: <Sub3 />, auth: "admin" },
  { path: "/dashboard/js2-subject", element: <Sub2 />, auth: "admin" },
  { path: "/dashboard/jamb", element: <Jamb />, auth: "admin" },
  { path: "/dashboard/waec", element: <Waec />, auth: "admin" },
  { path: "/dashboard/syllabus", element: <Syllabus /> },
  { path: "/dashboard/ss1-science-subject", element: <Sub4 />, auth: "admin" },
  { path: "/dashboard/ss1-art-subject", element: <Sub5 />, auth: "admin" },
  {
    path: "/dashboard/ss1-commercial-subject",
    element: <Sub6 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss1-technology-subject",
    element: <Sub14 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-science-subject",
    element: <Sub7 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-art-subject",
    element: <Sub8 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-commercial-subject",
    element: <Sub9 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-science-subject",
    element: <Sub10 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-art-subject",
    element: <Sub11 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-commercial-subject",
    element: <Sub12 />,
    auth: "admin",
  },

  { path: "/dashboard/manage-mark-view", element: <ManagemarkView /> },
  {
    path: "/dashboard/jss1-student_information",
    element: <Info />,
    auth: "admin",
  },
  // {
  //   path: "/dashboard/jss1B-student_information",
  //   element: <Js1b />,
  //   auth: "admin",
  // },
  {
    path: "/dashboard/onscreen-marking-online",

    element: <OnScreen />,
    auth: "admin",
  },
  {
    path: "/dashboard/onscreen-marking-offline",

    element: <OnOff />,
    auth: "admin",
  },
  {
    path: "/dashboard/onscreen-marking",

    element: <Screen />,
    auth: "admin",
  },
  {
    path: "/dashboard/jss2-student_information",
    element: <Info2 />,
    auth: "admin",
  },
  {
    path: "/dashboard/jss3-student_information",
    element: <Info3 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss1-science-student_information",
    element: <Info4 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss1-art-student_information",
    element: <Info5 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss1-commercial-student_information",
    element: <Info6 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-science-student_information",
    element: <Info7 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-art-student_information",
    element: <Info8 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss2-commercial-student_information",
    element: <Info9 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-science-student_information",
    element: <Info10 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-art-student_information",
    element: <Info11 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss3-commercial-student_information",
    element: <Info12 />,
    auth: "admin",
  },
  {
    path: "/dashboard/ss1-technology-student_information",
    element: <Info13 />,
    auth: "admin",
  },

  { path: "/dashboard/teacher", element: <Teacher />, auth: "admin" },
  { path: "/dashboard/parent", element: <Parent />, auth: "admin" },
  { path: "/dashboard/add_notice", element: <NoticeBoard />, auth: "admin" },
  { path: "/dashboard/noticeboard", element: <ViewNotice />, auth: "admin" },
  { path: "/dashboard/subject", element: <Subject />, auth: "admin" },
  { path: "/dashboard/class", element: <Class />, auth: "admin" },
  { path: "/dashboard/exam", element: <Exam />, auth: "admin" },
  { path: "/dashboard/grade", element: <Grade />, auth: "admin" },
  { path: "/dashboard/generate-question", element: <PQ />, auth: "admin" },
  { path: "/dashboard/curriculum", element: <Curriculum />, auth: "admin" },
  {
    path: "/dashboard/tabulation-sheet",
    element: <Tab />,
    auth: "admin",
  },
    // ── Bulk Print Route ──
  {
    path: "/dashboard/bulk-print/:classId/:term",
    element: <BulkPrintClass />,
    auth: "admin",
  },
  {
    path: "/dashboard/online-exam",
    element: <Online />,
    auth: "admin",
  },
  {
    path: "/dashboard/create-utme-question",
    element: <CreateJamb />,
    auth: "admin",
  },
  {
    path: "/dashboard/manage-online-exam",
    element: <Manage />,
    auth: "admin",
  },
  {
    path: "/dashboard/jamb-past-question",
    element: <ManageJamb />,
    auth: "admin",
  },
  {
    path: "/dashboard/manage-online-exam/:id",
    element: <ManSin />,
    auth: "admin",
  },
  {
    path: "/dashboard/manage-jamb-question/:id",
    element: <JambSingle />,
    auth: "admin",
  },
  {
    path: "/dashboard/view-result/:id",
    element: <ViewResult />,
    auth: "admin",
  },
  {
    path: "/dashboard/student_mark_sheet/:id",
    element: <MarkSheet />,
    auth: "admin",
  },
  {
    path: "/dashboard/report_card/:id",
    element: <ReportCard />,
    auth: "admin",
  },
  // {
  //   path: "/dashboard/term_report_card/:id",
  //   element: <TermRep />,
  //   auth: "admin",
  // },
  {
    path: "/dashboard/term_report_card/:id",
    element: <TermRepCont />,
    auth: "admin",
  },

  {
    path: "/dashboard/first_term_report_card/:id",
    element: <FirstTermRepCont />,
    auth: "admin",
  },
  {
    path: "/dashboard/third_term_report_card/:id",
    element: <ThirdTermRepCont />,
    auth: "admin",
  },

  {
    path: "/dashboard/student-payment",
    element: <Payment />,
    auth: "admin",
  },
  {
    path: "/dashboard/view-receipt/:id",
    element: <ViewReceipt />,
    auth: "admin",
  },
  {
    path: "/dashboard/student-receipt",
    element: (
      <ReceiptProvider>
        <StuReceipt />
      </ReceiptProvider>
    ),
    auth: "admin",
  },

  { path: "/dashboard/profile", element: <Profile />, auth: "admin" },
  { path: "/dashboard/setting", element: <Setting />, auth: "admin" },
  { path: "/dashboard/account", element: <Account />, auth: "admin" },
  {
    path: "/dashboard/psychomotor_report_cat",
    element: <PsyCat />,
    auth: "admin",
  },
  {
    path: "/dashboard/manage_psychomotor",
    element: <ManagePsy />,
    auth: "admin",
  },
  {
    path: "/dashboard/study-material",
    element: <StudyMat />,
    auth: "admin",
  },
  {
    path: "/dashboard/attendance",
    element: <Attendance />,
    auth: "admin",
  },
  {
    path: "/dashboard/promotion",
    element: <Promotion />,
    auth: "admin",
  },
];

export default adminDashboardRoutes;
