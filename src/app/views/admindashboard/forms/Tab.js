import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Stack } from "@mui/material";
import React from "react";

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

import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { ToastContainer, toast } from "react-toastify";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

const Tab = () => {
  const { currentSession } = useContext(SessionContext);

  const {
    data:classData,
    loading: classLoading,
    error: classError,
  } = useFetch(
      currentSession ? `/class/${currentSession._id}` : null      
    );
    console.log(classData)
    const { data: examData } = useFetch(
      currentSession ? `/getofflineexam/${currentSession._id}` : null
    );
    console.log(examData)
  const [subjectData, setSubjectData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");


  const [studentData, setStudentData] = useState([]);
  console.log("Current studentData state:", studentData);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [subjectIdLookup, setSubjectIdLookup] = useState({});
  const [showMarkManagement, setShowMarkManagement] = useState(false);

  // const subjects = ["English", "Math", "Crs", "Basic Tech", "Business Studies"];
  const [students, setStudents] = useState(studentData);


  const apiUrl = process.env.REACT_APP_API_URL.trim();

  const fetchStudentData = async (examId, subjectId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      const response = await fetch(
        `${apiUrl}/api/get-all-scores/${examId}/${subjectId}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to fetch student data. Response details:",
          response
        );
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching student data:", error);
      return { scores: [] }; // Return empty array if there's an error
    }
  };

  // const handleManageMarkClick = async () => {
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = new Headers();
  //     headers.append("Authorization", `Bearer ${token}`);

  //     const response = await fetch(`${apiUrl}/api/student/${selectedClass}/${currentSession._id}`, {
  //       headers,
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch student data");
  //     }

  //     const students = await response.json();

  //     // Handle the case where no students are found
  //     if (students.length === 0) {
  //       console.warn("No students found for the selected class.");
  //       // Proceed with the logic for initializing the state, etc.
  //       // You might want to show a message to the user or take appropriate action.
  //     } else {
  //       // Assuming you want to pick the first student for now
  //       const firstStudentId = students[0]._id;
  //       setSelectedStudentId(firstStudentId);

  //       const existingData = await fetchStudentData(
  //         selectedExam,
  //         subjectIdLookup[selectedSubject]
  //       );

  //       console.log("Response from fetchStudentData:", existingData);
  //       console.log("Existing scores:", existingData.scores);

  //       // Ensure that the scores are properly set in the initial state
  //       const initialState = students.map((student) => {
  //         const studentScore = existingData.scores.find(
  //           (score) => score.studentId && score.studentId._id === student._id
  //         );

  //         console.log(`Student ${student._id} - Existing Score:`, studentScore);

  //         const defaultTestScore = studentScore
  //           ? studentScore.testscore !== undefined
  //             ? studentScore.testscore
  //             : 0
  //           : 0;

  //         const defaultExamScore = studentScore
  //           ? studentScore.examscore !== undefined
  //             ? studentScore.examscore
  //             : 0
  //           : 0;

  //         return {
  //           studentId: student._id,
  //           studentName: student.studentName,
  //           testscore: defaultTestScore,
  //           examscore: defaultExamScore,
  //           marksObtained: defaultTestScore + defaultExamScore,
  //           comment: studentScore ? studentScore.comment || "" : "",
  //         };
  //       });

  //       console.log("Initial state:", initialState);

  //       setStudentData(initialState);
  //       setShowMarkManagement(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //   }
  // };
  const handleManageMarkClick = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    // Fetch students for the selected class and session
    const response = await fetch(
      `${apiUrl}/api/student/${selectedClass}/${currentSession._id}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch student data");
    }

    const students = await response.json();

    if (!students || students.length === 0) {
      console.warn("No students found for the selected class.");
      setStudentData([]);
      setShowMarkManagement(false);
      return;
    }

    // Optionally, select the first student
    setSelectedStudentId(students[0]._id);

    // Fetch existing scores for the selected exam and subject
    const existingData = await fetchStudentData(
      selectedExam,
      subjectIdLookup[selectedSubject]
    );

    console.log("Response from fetchStudentData:", existingData);

    // Map students to include subjects and their scores
    const initialState = students.map((student) => {
      // Filter scores for this student
      const studentScores = existingData.scores.filter(
        (score) => score.studentId && score.studentId._id === student._id
      );

      // Map each subject to its score
      const subjectsWithScores = subjectData.map((subj) => {
        const scoreForSubject = studentScores.find(
          (s) => s.subjectId === subj._id
        ) || {};

        const test = scoreForSubject.testscore || 0;
        const exam = scoreForSubject.examscore || 0;

        return {
          subjectId: subj._id,
          test,
          exam,
          total: test + exam,
        };
      });

      return {
        studentId: student._id,
        studentName: student.studentName,
        subjects: subjectsWithScores,
      };
    });

    console.log("Initial state with subjects:", initialState);

    setStudentData(initialState);
    setShowMarkManagement(true);
  } catch (error) {
    console.error("Error fetching student data:", error);
  }
};

const handleSubjectScoreChange = (
  studentIndex,
  subjectId,
  field,
  value
) => {
  setStudentData((prev) =>
    prev.map((student, sIdx) => {
      if (sIdx !== studentIndex) return student;

      return {
        ...student,
        subjects: student.subjects.map((subj) => {
          if (subj.subjectId !== subjectId) return subj;

          const updated = {
            ...subj,
            [field]: value,
          };

          updated.total =
            Number(updated.test || 0) + Number(updated.exam || 0);

          return updated;
        }),
      };
    })
  );
};

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        if (!selectedClass) {
          setSubjectData([]);
          setSubjectIdLookup({});
          return;
        }

        const token = localStorage.getItem("jwtToken");
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`);

    const response = await fetch(
  `${apiUrl}/api/get-subject/${selectedClass}/${currentSession._id}`,
  { headers }
);


        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await response.json();

        setSubjectData(data);

        // Create a subjectId l
        const lookup = {};
        data.forEach((subject) => {
          lookup[subject.name] = subject._id;
        });  
        setSubjectIdLookup(lookup);
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
    setSelectedSubject(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const marks = studentData.map((student) => {
        const {
          studentId,
          testscore = 0,
          examscore = 0,
          comment = "",
        } = student;
        const marksObtained = testscore + examscore;

        return {
          studentId,
          subjectId: subjectIdLookup[selectedSubject],
          testscore,
          examscore,
          marksObtained,
          comment,
        };
      });

      console.log("Updated Marks:", marks);

      const token = localStorage.getItem("jwtToken");
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${token}`);

      // Check if there are existing marks by verifying the examId and subjectId
      if (selectedExam && subjectIdLookup[selectedSubject]) {
        const responseCheckMarks = await fetch(
          `${apiUrl}/api/get-all-scores/${selectedExam}/${subjectIdLookup[selectedSubject]}`,
          {
            headers,
          }
        );

        console.log("Response from Check Marks:", responseCheckMarks);

        if (responseCheckMarks.ok) {
          const responseData = await responseCheckMarks.json();
          const existingMarks = responseData.scores || [];

          // Check if there are existing marks
          if (existingMarks.length > 0) {
            // Existing marks found, proceed with updating
            const responseUpdateMarks = await fetch(
              `${apiUrl}/api/update-all-marks`,
              {
                method: "PUT",
                headers: {
                  ...headers,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  examId: selectedExam,
                  subjectId: subjectIdLookup[selectedSubject],
                  updates: marks,
                }),
              }
            );

            console.log("Request Payload:", {
              examId: selectedExam,
              subjectId: subjectIdLookup[selectedSubject],
              updates: marks,
            });

            console.log("Response from Update Marks:", responseUpdateMarks);

            if (!responseUpdateMarks.ok) {
              const errorMessage = await responseUpdateMarks.text();
              console.error(
                `Failed to update marks. Server response: ${errorMessage}`
              );
              throw new Error("Failed to update marks");
            } else {
              // Notify success using toast
              toast.success("Marks updated successfully!");
            }
          } else {
            // No existing marks found, proceed to create new marks
            const responseSaveMarks = await fetch(`${apiUrl}/api/save-marks`, {
              method: "POST",
              headers: {
                ...headers,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                examId: selectedExam,
                subjectId: subjectIdLookup[selectedSubject],
                updates: marks,
              }),
            });

            console.log("Response from Save Marks:", responseSaveMarks);

            if (!responseSaveMarks.ok) {
              const errorMessage = await responseSaveMarks.text();

              console.error(
                `Failed to save marks. Server response: ${errorMessage}`
              );
              throw new Error("Failed to save marks");
            } else {
              // Notify success using toast
              toast.success("Marks saved successfully!");
            }
          }
        } else {
          // Handle other response statuses
          // ...
        }
      }
      // ... (remaining code)
    } catch (error) {
      console.error("Error saving marks:", error);
      // ... (error handling)
    }
  };

  const handleScoreChange = (studentIndex, scoreType, value) => {
    // Create a copy of the studentData array
    const updatedStudents = studentData.map((student, index) => {
      if (index === studentIndex) {
        // Update the relevant score type or comment
        if (scoreType === "testscore") {
          return {
            ...student,
            testscore: parseInt(value, 10) || 0, // Update test score
            marksObtained: (parseInt(value, 10) || 0) + (student.examscore || 0) // Calculate marksObtained
          };
        } else if (scoreType === "examscore") {
          return {
            ...student,
            examscore: parseInt(value, 10) || 0, // Update exam score
            marksObtained: (student.testscore || 0) + (parseInt(value, 10) || 0) // Calculate marksObtained
          };
        } else if (scoreType === "comment") {
          return {
            ...student,
            comment: value // Update comment field
          };
        }
      }
      return student;
    });
  
    // Update state with modified student data
    setStudentData(updatedStudents);
  };
  

return (
  <div style={{ padding: "20px" }}>
    <Container>
      <ValidatorForm onError={() => null}>
        <Box mb={3}>
          <h2>Manage Exam Marks</h2>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Select Exam"
              variant="outlined"
              value={selectedExam}
              onChange={handleExamChange}
            >
              {examData?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Select Class"
              variant="outlined"
              value={selectedClass}
              onChange={handleClassChange}
            >
              {classData?.map((item) => (
                <MenuItem key={item.id} value={item.name}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={handleManageMarkClick}
              sx={{ height: "56px" }}
            >
              View Tabulation Sheet
            </Button>
          </Grid>
        </Grid>

        {/* Broad Sheet Table */}
        {showMarkManagement && (
          <>
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid #ddd",
              }}
            >
              <Table
                sx={{
                  minWidth: subjectData.length * 240 + 300, // 🔥 dynamic width
                  borderCollapse: "collapse",

                  "& th, & td": {
                    border: "1px solid #ddd",
                    padding: "10px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                  },

                  "& th": {
                    backgroundColor: "#f4f6f8",
                    fontWeight: "bold",
                  },

                  "& input": {
                    width: "70px",
                    padding: "6px",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
              <TableCell
  rowSpan={2}
  sx={{
    minWidth: "260px",
    width: "260px",
    maxWidth: "260px",
    whiteSpace: "normal",
    fontWeight: "bold",
  }}
>
  Student Name
</TableCell>


                    {subjectData?.map((subj) => (
                      <TableCell key={subj._id} colSpan={3}>
                        {subj.name}
                      </TableCell>
                    ))}

                    <TableCell rowSpan={2} sx={{ minWidth: "90px" }}>
                      Total
                    </TableCell>
                    <TableCell rowSpan={2} sx={{ minWidth: "90px" }}>
                      Average
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    {subjectData?.map((subj) => (
                      <React.Fragment key={subj._id}>
                        <TableCell>Test</TableCell>
                        <TableCell>Exam</TableCell>
                        <TableCell>Total</TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {studentData.map((student, idx) => {
                    let overallTotal = 0;

                    return (
                      <TableRow key={student.studentId || idx}>
                        <TableCell
                          sx={{
                            textAlign: "left",
                            fontWeight: 500,
                          }}
                        >
                          {student.studentName}
                        </TableCell>

                   {student.subjects?.map((subj, sIdx) => {

  const test = Number(subj.test) || 0;
  const exam = Number(subj.exam) || 0;
  const total = test + exam;
  overallTotal += total;

                          return (
                            <React.Fragment key={sIdx}>
                              <TableCell>
                                <input
                                  type="number"
                                  value={test}
                                  onChange={(e) =>
                                    handleSubjectScoreChange(
                                      idx,
                                      subj,
                                      "test",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  value={exam}
                                  onChange={(e) =>
                                    handleSubjectScoreChange(
                                      idx,
                                      subj,
                                      "exam",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>{total}</TableCell>
                            </React.Fragment>
                          );
                        })}

                        <TableCell sx={{ fontWeight: "bold" }}>
                          {overallTotal}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {(overallTotal / subjectData.length).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2}>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
            </Box>
          </>
        )}
      </ValidatorForm>

      <ToastContainer />
    </Container>
  </div>
);

};

export default Tab;
