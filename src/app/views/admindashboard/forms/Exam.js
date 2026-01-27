
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Breadcrumb, SimpleCard } from "../../../../app/components";
import axios from "axios";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  Radio,
  MenuItem,
  DialogTitle,
  RadioGroup,
  styled,
} from "@mui/material";
import useFetch from "../../../../hooks/useFetch";
import { Span } from "../../../../app/components/Typography";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SessionContext } from "../../../components/MatxLayout/Layout1/SessionContext";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const Exam = () => {
  const { currentSession } = useContext(SessionContext);

  const {
    data: classData,
    loading: classLoading,
    error: classError,
  } = useFetch(currentSession ? `/class/${currentSession._id}` : null);
  console.log(classData);
  const { data: examData } = useFetch(
    currentSession ? `/getofflineexam/${currentSession._id}` : null
  );
  console.log(examData);
  const [subjectData, setSubjectData] = useState([]);
  console.log("sub", subjectData);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const [studentData, setStudentData] = useState([]);
  console.log("Current studentData state:", studentData);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // const [subjectIdLookup, setSubjectIdLookup] = useState({});
  const [showMarkManagement, setShowMarkManagement] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;



  const gradeDefinitions = [
    { markfrom: 70, markupto: 100, comment: "Excellent", grade: "A" },
    { markfrom: 60, markupto: 69, comment: "Very Good", grade: "B" },
    { markfrom: 50, markupto: 59, comment: "Good", grade: "C" },
    { markfrom: 45, markupto: 49, comment: "Fairly Good", grade: "D" },
    { markfrom: 40, markupto: 44, comment: "Poor", grade: "E" },
    { markfrom: 0, markupto: 39, comment: "Poor", grade: "F" },
  ];
const fetchStudentData = async (examId, subjectId, sessionId) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    const response = await fetch(
      // `${apiUrl}/api/get-all-scores/${examId}/${subjectId}/${sessionId}`,
      `${apiUrl}/api/get-all-scores/${selectedExam}/${selectedSubject}/${currentSession._id}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching student data:", error);
    return { scores: [] };
  }
};


const normalizeId = (id) => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object") return id._id || id.toString();
  return String(id);
};

const handleManageMarkClick = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    // 1️⃣ Fetch students
    const studentRes = await fetch(
      `${apiUrl}/api/student/${selectedClass}/${currentSession._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!studentRes.ok) throw new Error("Failed to fetch students");

    const students = await studentRes.json();

    if (!students.length) {
      setStudentData([]);
      setShowMarkManagement(true);
      return;
    }

    // 2️⃣ Fetch scores (same as Postman)
    const scoreRes = await fetch(
      // `${apiUrl}/api/get-all-scores/${selectedExam}/${subjectIdLookup[selectedSubject]}/${currentSession._id}`,
      `${apiUrl}/api/get-all-scores/${selectedExam}/${selectedSubject}/${currentSession._id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const scoreData = scoreRes.ok ? await scoreRes.json() : { scores: [] };

    console.log("Scores from API:", scoreData.scores);

    // 3️⃣ Merge students + scores
const merged = students.map((student) => {
  const score = scoreData.scores.find(
    (s) =>
      normalizeId(s.studentId) === normalizeId(student._id)
  );

  return {
    studentId: student._id,
    studentName: student.studentName,
    AdmNo: student.AdmNo || student.admNo,
    testscore: score ? Number(score.testscore) : "",
    examscore: score ? Number(score.examscore) : "",
    marksObtained: score
      ? Number(score.testscore) + Number(score.examscore)
      : "",
    comment: score?.comment ?? ""
  };
});


    console.log("Merged data:", merged);

    setStudentData(merged);
    setShowMarkManagement(true);
  } catch (err) {
    console.error("❌ Error loading marks:", err);
  }
};


console.log("selectedclass: ", selectedClass);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        if (!selectedClass) {
          setSubjectData([]);
          // setSubjectIdLookup({});
          return;
        }

        const token = localStorage.getItem("jwtToken");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);

        const response = await fetch(
          `${apiUrl}/api/get-subject/${selectedClass}/${currentSession._id}`,
          {
            headers,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await response.json();

        setSubjectData(data);

        // Create a subjectId lookup
        // const lookup = {};
        // data.forEach((subject) => {
        //   lookup[subject.name] = subject._id;
        // });
        // setSubjectIdLookup(lookup);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    // Call the fetchSubjectData function
    fetchSubjectData();
  }, [selectedClass, apiUrl]); // Include all dependencies used inside the useEffect

  const handleClassChange = (event) => {
    const newSelectedClass = event.target.value;
    setSelectedClass(newSelectedClass);
      console.log("Selected Class (from dropdown):", newSelectedClass);
    setSelectedSubject("");
  };

  const handleExamChange = (event) => {
    const selectedExamId = event.target.value;
    setSelectedExam(selectedExamId);
  };
  const getExamNameById = (examId) => {
    const selectedExam = examData.find((item) => item._id === examId);
    return selectedExam ? selectedExam.name : "";
  };

  const getClassById = (classId) => {
    const selectedClass = classData.find((item) => item.id === classId);
    return selectedClass ? selectedClass.name : "";
  };

  const getSubjectById = (subjectId) => {
    const selectedSubject = subjectData.find((item) => item._id === subjectId);
    return selectedSubject ? selectedSubject.name : "";
  };

 
const handleSubjectChange = (event) => {
  const subjectId = event.target.value;

  console.log("🟢 Subject selected (ID):", subjectId);

  const subject = subjectData.find(s => s._id === subjectId);
  console.log("🟡 Subject name:", subject?.name);

  setSelectedSubject(subjectId);
};


// const handleSaveChanges = async () => {
//   try {
//     const token = localStorage.getItem("jwtToken");

//     const payload = {
//       examId: selectedExam,
//       // subjectId: subjectIdLookup[selectedSubject],
//       subjectId: selectedSubject,
//       updates: studentData.map((s) => ({
//         studentId: s.studentId,
//         testscore: s.testscore === "" ? undefined : Number(s.testscore),
//         examscore: s.examscore === "" ? undefined : Number(s.examscore),
//         comment: s.comment === "" ? undefined : s.comment,
//       })),
//     };

//     // Decide endpoint and method
//     let url = "";
//     let method = "";

//     // If all students are new (no existing scores) → saveMark
//     const allNew = studentData.every(
//       (s) => s.testscore === "" && s.examscore === ""
//     );

//     if (allNew) {
//       url = `${apiUrl}/api/save-marks/${currentSession._id}`;
//       method = "POST";
//     } else {
//       // If any student has a score → update existing marks
//       url = `${apiUrl}/api/update-all-marks`;
//       method = "PUT";
//     }

//     const res = await fetch(url, {
//       method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.message || "Failed to save/update marks");
//     }

//     toast.success("Marks saved/updated successfully");
//   } catch (err) {
//     console.error(err);
//     toast.error(err.message || "Save/update failed");
//   }
// };
const handleSaveChanges = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    const payload = {
      examId: selectedExam,
      subjectId: selectedSubject,
      // updates: studentData.map((s) => ({
      //   studentId: s.studentId,
      //   testscore: Number(s.testscore || 0),
      //   examscore: Number(s.examscore || 0),
      //   comment: s.comment || "",
      // })),
      updates: studentData.map((s) => ({
  studentId: s.studentId,
  // Only include testscore/examscore if they are not empty
  ...(s.testscore !== "" && { testscore: Number(s.testscore) }),
  ...(s.examscore !== "" && { examscore: Number(s.examscore) }),
  ...(s.comment !== "" && { comment: s.comment }),
})),

    };

    const res = await fetch(
      `${apiUrl}/api/save-marks/${currentSession._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to save marks");
    }

    toast.success("Marks saved successfully");
  } catch (err) {
    console.error("❌ Save error:", err);
    toast.error(err.message || "Save failed");
  }
};


  // const handleScoreChange = (index, scoreType, value) => {
  //   // Assuming studentData is an array
  //   const updatedStudents = [...studentData];

  //   // Update the corresponding score
  //   if (scoreType === "testscore") {
  //     updatedStudents[index].testscore = parseInt(value, 10) || 0;
  //   } else if (scoreType === "examscore") {
  //     updatedStudents[index].examscore = parseInt(value, 10) || 0;
  //   } else if (scoreType === "comment") {
  //     updatedStudents[index].comment = value; // Update the comment field
  //   }

  //   // Update marksObtained by adding test score and exam score
  //   updatedStudents[index].marksObtained =
  //     (updatedStudents[index].testscore || 0) +
  //     (updatedStudents[index].examscore || 0);

  //   // Update state with the modified students
  //   setStudentData(updatedStudents);
  // };
  const handleScoreChange = (index, scoreType, value) => {
    // Assuming studentData is an array
    const updatedStudents = [...studentData];

    // Update the corresponding score
    if (scoreType === "testscore") {
      updatedStudents[index].testscore = parseInt(value, 10) || 0;
    } else if (scoreType === "examscore") {
      updatedStudents[index].examscore = parseInt(value, 10) || 0;
    } else if (scoreType === "comment") {
      updatedStudents[index].comment = value; // Update the comment field
    }

    // Update marksObtained by adding test score and exam score
    updatedStudents[index].marksObtained =
      (updatedStudents[index].testscore || 0) +
      (updatedStudents[index].examscore || 0);

    // Calculate comment based on marks obtained and grade definitions
    const comment = calculateComment(
      updatedStudents[index].marksObtained,
      gradeDefinitions
    );

    // Update the comment field
    updatedStudents[index].comment = comment;

    // Update state with the modified students
    setStudentData(updatedStudents);
  };

  const calculateComment = (marksObtained, gradeDefinitions) => {
    console.log("Calculating Comment for Marks:", marksObtained);

    // Find the corresponding grade based on marksObtained
    const matchingGrade = gradeDefinitions.find((grade) => {
      console.log(
        "Checking Grade:",
        grade.markfrom,
        grade.markupto,
        marksObtained,
        parseFloat(grade.markfrom),
        parseFloat(grade.markupto),
        parseFloat(marksObtained)
      );

      return (
        marksObtained >= parseFloat(grade.markfrom) &&
        marksObtained <= parseFloat(grade.markupto)
      );
    });

    console.log("Matching Grade:", matchingGrade);

    // Return the comment if a matching grade is found
    return matchingGrade ? matchingGrade.comment : "-";
  };

  return (
    <div>
      <Container>
        <ValidatorForm onError={() => null}>
          <Box className="breadcrumb">
            <Breadcrumb routeSegments={[{ name: "Manage Exam Mark" }]} />
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={4}>
              <TextField
                select
                label="Select an Exam"
                variant="outlined"
                value={selectedExam}
                onChange={handleExamChange}
              >
                {examData &&
                  examData.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                label="Select a class"
                variant="outlined"
                value={selectedClass}
                onChange={handleClassChange}
              >
                {classData &&
                  classData.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              {/* <TextField
                select
                label="Select the subject"
                variant="outlined"
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                {subjectData &&
                  subjectData.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TextField> */}
              <TextField
  select
  label="Select the subject"
  variant="outlined"
  value={selectedSubject}
  onChange={handleSubjectChange}
>
  {subjectData.map((item) => (
    <MenuItem key={item._id} value={item._id}>
      {item.name}
    </MenuItem>
  ))}
</TextField>

            </Grid>
            <Grid item xs={4}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onClick={handleManageMarkClick}
              >
                Manage Mark
              </Button>
            </Grid>
          </Grid>

          {showMarkManagement && (
            <>
              <div className="col-sm-4">
                <div className="tile-stats tile-gray">
                  <div className="icon">
                    <i className="entypo-chart-bar"></i>
                  </div>
                  <h3 style={{ color: "#696969" }}>
                    Marks For: {getExamNameById(selectedExam)}
                  </h3>

                  <h4 style={{ color: "#696969" }}>Class: {selectedClass}</h4>
                  <h4 style={{ color: "#696969" }}>
                   Subject: {getSubjectById(selectedSubject)}

                  </h4>
                </div>
              </div>
              <div class="col-xl-12 wow fadeInUp" data-wow-delay="1.5s">
                <div class="table-responsive full-data">
                  <table
                    class="table-responsive-lg table display dataTablesCard student-tab dataTable no-footer"
                    id="example-student"
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Adm No</th>
                        <th>Name</th>
                        <th>Test</th>
                        <th>Exam</th>
                        <th>Marks Obtained</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                <tbody>
  {studentData.map((student, index) => (
    <tr key={student.studentId}>
      <td>{index + 1}</td>
      <td>{student.AdmNo}</td>
      <td>{student.studentName}</td>

      <td>
        <TextField
          type="number"
          value={student.testscore ?? ""}
          onChange={(e) =>
            handleScoreChange(index, "testscore", Number(e.target.value))
          }
        />
      </td>

      <td>
        <TextField
          type="number"
          value={student.examscore ?? ""}
          onChange={(e) =>
            handleScoreChange(index, "examscore", Number(e.target.value))
          }
        />
      </td>

      <td>{student.marksObtained ?? ""}</td>

      <td>
        <TextField
          value={
            student.marksObtained !== undefined
              ? calculateComment(
                  student.marksObtained,
                  gradeDefinitions
                ) || "-"
              : ""
          }
          disabled
        />
      </td>
    </tr>
  ))}
</tbody>

                  </table>
                </div>
              </div>
              <Button
                color="primary"
                variant="contained"
                type="button"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </>
          )}
        </ValidatorForm>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Exam;