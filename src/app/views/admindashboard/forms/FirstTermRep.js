import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  Box,
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import useFetch from "../../../../hooks/useFetch";
import axios from "axios";
import useAuth from "../../../../app/hooks/useAuth";
import { SessionContext } from "../../../components/MatxLayout/Layout1/SessionContext";

import "./report.css";
import "./print.css";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const FirstTermRep = ({ studentId }) => {
  const componentRef = useRef();
  const gradeDefinitions = [
    { markfrom: 70, markupto: 100, comment: "Excellent", grade: "A" },
    { markfrom: 60, markupto: 69, comment: "Very Good", grade: "B" },
    { markfrom: 50, markupto: 59, comment: "Good", grade: "C" },
    { markfrom: 45, markupto: 49, comment: "Fairly Good", grade: "D" },
    { markfrom: 40, markupto: 44, comment: "Poor", grade: "E" },
    { markfrom: 0, markupto: 39, comment: "Poor", grade: "F" },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handlePrintInNewTab = () => {
    // Open a new window/tab
    const printWindow = window.open("", "_blank");

    // Generate printable content
    const contentToPrint = componentRef.current.cloneNode(true);
    const elementsToHide = contentToPrint.querySelectorAll(".dont-print");
    elementsToHide.forEach((element) => {
      element.style.display = "none";
    });

    // Append content to the new window/tab
    printWindow.document.body.appendChild(contentToPrint);

    // Copy styles from the current document to the new window/tab
    const styleSheets = [...document.styleSheets]
      .map((styleSheet) => {
        try {
          return [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.error("Error accessing stylesheet:", e);
          return "";
        }
      })
      .join("\n");

    const styleElement = printWindow.document.createElement("style");
    styleElement.textContent = styleSheets;
    printWindow.document.head.appendChild(styleElement);

    // Trigger print dialog
    printWindow.print();
  };

  const [studentData, setStudentData] = useState([]);
  const [psyData, setPsyData] = useState(null);
  const { currentSession } = useContext(SessionContext);

  const { id } = useParams();

  // const { data } = useFetch(`/students/${id}`);

  const { data } = useFetch(`/get-students/${studentId}/${currentSession._id}`);

  // const { data,  } = useFetch(`/students/${user._id}`); // Fetch data using the correct URL

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("");

  const [error, setError] = useState(null);
  const [schoolSettings, setSchoolSettings] = useState({
    principalName: "",
    resumptionDate: "",
    signature: "",
  });
  const [accountSettings, setAccountSettings] = useState({
    name: "",
    motto: "",
    address: "",
    phone: "",
    phonetwo: "",
    email: "",
    sessionStart: "",
    sessionEnd: "",
    schoolLogo: "",
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);

  //     try {
  //       // Fetch student data
  //       const studentData = await fetchStudentData(studentId);

  //       // Set the student data in state
  //       setStudentData(studentData);

  //       setLoading(false);
  //     } catch (error) {
  //       // Handle errors
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();

  //   console.log("Student ID in useEffect:", studentId);
  // }, [studentId, currentSession]);
  useEffect(() => {
    if (!studentId || !currentSession?._id) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const studentScores = await fetchStudentData(studentId);
        setStudentData(studentScores);
      } catch (error) {
        console.error("Error loading student scores:", error);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, currentSession]);

  const fetchclassteacher = async (studentId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("JWT token not found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/class/${currentSession._id}`,
        { headers }
      );

      // Debug: Log the entire API response
      console.log("API Response for class:", response.data);

      // Assuming 'data' holds the student data
      const studentClassName = data?.classname; // Replace with correct field
      if (!studentClassName) {
        throw new Error("Student's class is not found");
      }

      // Find the class that matches the student's class name
      const matchedClass = response.data.find(
        (classItem) => classItem.name === studentClassName
      );

      if (matchedClass) {
        console.log("Class Teacher:", matchedClass.teacher);
        setTeacherName(matchedClass.teacher);
        return matchedClass.teacher;
      } else {
        console.log("No class found matching the student's class.");
      }
    } catch (error) {
      console.error("Error fetching class teacher:", error);
      // throw new Error("Failed to fetch class teacher");
    }
  };

  fetchclassteacher();

  // const fetchStudentData = async (studentId) => {
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     if (!token) {
  //       throw new Error("JWT token not found");
  //     }

  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     const response = await axios.get(
  //       `${apiUrl}/api/get-scores-by-student/${studentId}/${currentSession._id}`,
  //       { headers }
  //     );

  //     const filteredScores = response.data.scores.filter(
  //       (score) =>
  //         (score.marksObtained !== undefined || score.marksObtained === 0) &&
  //         score.examId.name.toUpperCase() === "SECOND TERM"
  //     );

  //     if (filteredScores.length === 0) {
  //       throw new Error("No second term scores found for the student");
  //     }

  //     console.log("Filtered Scores:", filteredScores);

  //     const scoresWithPositions = await Promise.all(
  //       filteredScores.map(async (score) => {
  //         const { examId, subjectId } = score;

  //         if (!examId || !subjectId) {
  //           console.error(
  //             "Exam ID or Subject ID not found for a score:",
  //             score
  //           );
  //           return { ...score, position: 0 };
  //         }

  //         const allStudentsData = await fetchAllStudentsData(
  //           examId._id,
  //           subjectId._id
  //         );

  //         const sortedStudents = allStudentsData.sort(
  //           (a, b) => b.marksObtained - a.marksObtained
  //         );

  //         const studentPosition =
  //           sortedStudents.findIndex(
  //             (student) => student.studentId?._id === studentId
  //           ) + 1;

  //         console.log(
  //           `Position of current student for Subject ${subjectId._id} and Exam ${examId._id}:`,
  //           studentPosition
  //         );

  //         return {
  //           ...score,
  //           position: studentPosition,
  //         };
  //       })
  //     );

  //     console.log("Scores with Positions:", scoresWithPositions); // Log scores with positions

  //     // Make sure scoresWithPositions is an array with at least one element
  //     if (scoresWithPositions && scoresWithPositions.length > 0) {
  //       return scoresWithPositions;
  //     } else {
  //       throw new Error("No scores available");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     // throw new Error("Failed to fetch student data");
  //   }
  // };
  const fetchStudentData = async (studentId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("JWT token not found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/get-scores-by-student/${studentId}/${currentSession._id}`,
        { headers }
      );

      console.log("Raw Scores Response:", response.data);
      // console.log("Score being checked:", score);
      // console.log("Valid marks?", validMarks, "Is second term?", isSecondTerm);

      const filteredScores = response.data.scores.filter(
        (score) =>
          (score.marksObtained !== undefined || score.marksObtained === 0) &&
          // score.examId.name.toUpperCase() === "SECOND TERM"
          score?.examId?.name?.toUpperCase() === "FIRST TERM"
      );

      if (filteredScores.length === 0) {
        console.warn("No first term scores found for the student");
        return []; // <<< Important: Return empty array instead of throwing
      }
      console.log("Filtered Scores:", filteredScores);

      const scoresWithPositions = await Promise.all(
        filteredScores.map(async (score) => {
          const { examId, subjectId } = score;

          if (!examId || !subjectId) {
            console.error(
              "Exam ID or Subject ID not found for a score:",
              score
            );
            return { ...score, position: "-" }; // use placeholder
          }

          const allStudentsData = await fetchAllStudentsData(
            examId._id,
            subjectId._id
          );

          const sortedStudents = allStudentsData.sort(
            (a, b) => b.marksObtained - a.marksObtained
          );

          const studentPosition =
            sortedStudents.findIndex(
              (student) => student.studentId?._id === studentId
            ) + 1;

          return {
            ...score,
            position: studentPosition,
          };
        })
      );

      return scoresWithPositions;
    } catch (error) {
      console.error("Error fetching student data:", error);
      return []; // <<< Also important: always return [] on error
    }
  };
  // if (!examId || !subjectId) {
  //   console.error("Missing examId or subjectId:", score);
  // }

  const fetchAllStudentsData = async (examId, subjectId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("JWT token not found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${apiUrl}/api/get-all-scores/${examId}/${subjectId}`,
        { headers }
      );

      console.log("All Students Data:", response.data);

      const data = response.data;
      if (data && data.scores) {
        console.log("Number of students with marks:", data.scores.length);
        const studentsWithMarks = data.scores.filter(
          (student) =>
            student.marksObtained !== undefined && student.marksObtained !== 0
        );
        console.log("Students with marks:", studentsWithMarks);

        return studentsWithMarks;
      } else {
        console.log("No scores data available.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching all students data:", error);
      throw new Error("Failed to fetch all students data");
    }
  };

  // const fetchPsyData = async (studentId) => {
  //   console.log("Before API call...");
  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // const response = await axios.get(
  //     //   `${apiUrl}/api/get-psy-by-student/${studentId}/${currentSession._id}`,
  //     //   { headers }
  //     // );
  //     const term = "SECOND TERM";
  //     const response = await axios.get(
  //       `${apiUrl}/api/get-psy-by-student/${studentId}/${currentSession._id}?term=${term}`,
  //       { headers }
  //     );
  //     console.log("API response status:", response.status);
  //     console.log("Original data:", response.data);

  //     return { ...response.data };
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     throw new Error("Failed to fetch student data");
  //   }
  // };

  // const fetchPsyData = async (studentId, examId) => {
  //   console.log("Before API call...");

  //   // Log examId and currentSession._id to identify what is missing

  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // Make sure `examId` and `currentSession._id` are valid
  //     if (!examId || !currentSession?._id) {
  //       throw new Error("Missing examId or sessionId");
  //     }

  //     // Make the API call with the studentId, examId, and sessionId
  //     const response = await axios.get(
  //       `${apiUrl}/api/get-psy-by-student/${studentId}/${examId}/${currentSession._id}`,
  //       { headers }
  //     );
  //     console.log("examId:", examId);
  //     console.log(
  //       "currentSession._id:",
  //       currentSession ? currentSession._id : "No currentSession"
  //     );
  //     console.log("API response status:", response.status);
  //     console.log("Original data:", response.data);

  //     return { ...response.data }; // Return the data for further use
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     throw new Error("Failed to fetch student data");
  //   }
  // };
  // const fetchPsyData = async (studentId, examId) => {
  //   console.log("Before API call...");

  //   // Log `examId` and `currentSession` to ensure they are being passed correctly
  //   console.log("examId:", examId);
  //   console.log("currentSession:", currentSession);

  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // Make sure `examId` and `currentSession._id` are valid
  //     if (!examId || !currentSession?._id) {
  //       throw new Error("Missing examId or sessionId");
  //     }

  //     // Make the API call with the studentId, examId, and sessionId
  //     const response = await axios.get(
  //       `${apiUrl}/api/get-psy-by-student/${studentId}/${examId}/${currentSession._id}`,
  //       { headers }
  //     );
  //     console.log("API response status:", response.status);
  //     console.log("Original data:", response.data);

  //     return { ...response.data }; // Return the data for further use
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     throw new Error("Failed to fetch student data");
  //   }
  // };
  // const fetchPsyData = async (studentId) => {
  //   console.log("Before API call...");

  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };

  //     // Make sure currentSession._id is valid
  //     if (!currentSession?._id) {
  //       throw new Error("Missing sessionId");
  //     }

  //     // Make the API call with studentId and sessionId
  //     const response = await axios.get(
  //       `${apiUrl}/api/get-psy-by-student/${studentId}/${currentSession._id}`,
  //       { headers }
  //     );
  //     console.log("API response status:", response.status);
  //     console.log("Original data:", response.data);

  //     const filteredScores = response.data.marks.filter(
  //       (mark) => mark.examName?.toUpperCase() === "SECOND TERM" // Use examName instead of examId
  //     );

  //     if (filteredScores.length === 0) {
  //       console.warn("No second term scores found for the student");
  //       return []; // <<< Important: Return empty array instead of throwing
  //     }

  //     console.log("Filtered Scores:", filteredScores);

  //     return filteredScores; // Return filtered scores
  //   } catch (error) {
  //     console.error("Error fetching student data:", error);
  //     return []; // <<< Always return an empty array in case of error
  //   }
  // };
  const fetchPsyData = async (studentId) => {
    console.log("Before API call...");

    try {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Ensure currentSession._id is valid
      if (!currentSession?._id) {
        throw new Error("Missing sessionId");
      }

      // Define the exam name you are filtering by
      const examName = "FIRST TERM"; // You can dynamically set this if needed

      // Make the API call with studentId, sessionId, and examName as query params
      const response = await axios.get(
        `${apiUrl}/api/get-psy-by-student/${studentId}/${
          currentSession._id
        }?examName=${encodeURIComponent(examName)}`,
        { headers }
      );

      console.log("API response status:", response.status);
      console.log("Original data:", response.data);

      // Filter for "SECOND TERM" exam only (just in case)
      const filteredScores = response.data.marks.filter(
        (mark) => mark.examName?.toUpperCase() === "FIRST TERM"
      );

      if (filteredScores.length === 0) {
        console.warn("No first term scores found for the student");
        alert("No first term scores available for this student."); // User-friendly alert
        return []; // Return empty array
      }

      console.log("Filtered Scores:", filteredScores);
      return filteredScores; // Return filtered scores
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("An error occurred while fetching data. Please try again."); // Error message
      return []; // Always return empty array in case of error
    }
  };

  useEffect(() => {
    const fetchSchoolSettings = async () => {
      try {
        // Log the API URL and parameters being used
        console.log("Fetching School Settings...");
        console.log("API URL:", `${apiUrl}/api/setting`);
        console.log("Parameters:", {
          sessionId: currentSession._id,
          term: "FIRST TERM",
        });

        const response = await axios.get(`${apiUrl}/api/setting`, {
          params: {
            sessionId: currentSession._id,
            term: "FIRST TERM", // Or dynamically determine term
          },
        });

        // Log the full API response
        console.log("Full API Response:", response);

        // Extract data from the API response
        const { data } = response.data;

        // Log the extracted data
        console.log("Extracted Data (School Settings):", data);

        // Update state with the fetched data
        setSchoolSettings(data);
      } catch (error) {
        // Log the error if the API request fails
        console.error("Error fetching school settings:", error);
      }
    };

    fetchSchoolSettings();
  }, [apiUrl, currentSession]);
  useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/account-setting`);
        const { data } = response.data;

        // Set the retrieved school settings to the state
        setAccountSettings(data);
      } catch (error) {
        console.error("Error fetching school settings:", error);
      }
    };

    fetchAccountSettings();
  }, [apiUrl]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);

  //     try {
  //       const data = await fetchPsyData(studentId);
  //       console.log("PsyData:", data); // Add this line to check the data
  //       setPsyData(data);

  //       setLoading(false);
  //     } catch (error) {
  //       setError("Failed to fetch student data");
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();

  //   console.log("Student ID in useEffect:", studentId);
  // }, [studentId, currentSession]);
  // useEffect(() => {
  //   console.log("useEffect triggered");
  //   console.log("new studentId:", studentId);
  //   console.log("new currentSession:", currentSession);

  //   if (!studentId || !currentSession?._id) return;

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchPsyData(studentId);
  //       console.log("PsyData new fetched data:", data);
  //       console.log("PsyData marks structure:", data.marks); // Check the marks specifically

  //       setPsyData(data);
  //     } catch (error) {
  //       setError("Failed to fetch student data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [studentId, currentSession]);
  // useEffect(() => {
  //   console.log("useEffect triggered");
  //   console.log("new studentId:", studentId);
  //   console.log("new currentSession:", currentSession);

  //   if (!studentId || !currentSession?._id) return;

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await fetchPsyData(studentId);
  //       console.log("PsyData new fetched data:", data);
  //       console.log("PsyData marks structure:", data[0]?.marks); // Access the first element and then marks

  //       setPsyData(data[0]); // Set the first element to psyData
  //     } catch (error) {
  //       setError("Failed to fetch student data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [studentId, currentSession]);
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("new studentId:", studentId);
    console.log("new currentSession:", currentSession);

    if (!studentId || !currentSession?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPsyData(studentId);
        console.log("PsyData new fetched data:", data);

        // Assuming data is an array and the first element is the one you want
        const studentData = data[0];
        console.log("PsyData marks structure:", studentData?.marks); // Access marks directly from the first element

        setPsyData(studentData); // Set the student data directly, not the array
        // Log the entire psyData
        console.log("PsyData after setting:", studentData); // Log the full object
      } catch (error) {
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId, currentSession]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  console.log("New Student Data:", studentData); // Log studentData to check its structure

  let totalMarksObtained = 0;

  if (studentData && Array.isArray(studentData)) {
    totalMarksObtained = studentData.reduce(
      (total, score) => total + (score.marksObtained || 0),
      0
    );
  }

  console.log("Total Marks Obtained:", totalMarksObtained); // Log totalMarksObtained

  // const totalMarks = studentData?.scores
  //   ? studentData.scores.length * 100 // Assuming 100 marks per subject
  //   : 0;
  const totalMarks = studentData ? studentData.length * 100 : 0;

  // const averageMarks = studentData?.scores
  //   ? (
  //       (studentData.scores.reduce(
  //         (acc, score) => acc + (score.marksObtained || 0),
  //         0
  //       ) /
  //         totalMarks) *
  //       100
  //     ).toFixed(1)
  //   : 0;

  const averageMarks = totalMarks
    ? ((totalMarksObtained / totalMarks) * 100).toFixed(1)
    : 0;

  // const calculateGrade = (comment) => {
  //   // Use your existing gradeDefinitions to find a grade with a similar comment
  //   const matchingGrade = gradeDefinitions.find((grade) =>
  //     comment.toLowerCase().includes(grade.comment.toLowerCase())
  //   );

  //   // Return the grade if a matching grade is found
  //   return matchingGrade ? matchingGrade.grade : "-";
  // };

  const calculateGrade = (comment) => {
    // Use your existing gradeDefinitions to find a grade with a similar comment
    const matchingGrade = gradeDefinitions.find((grade) =>
      comment.toLowerCase().includes(grade.comment.toLowerCase())
    );

    // Return the grade if a matching grade is found
    return matchingGrade ? matchingGrade.grade : "-";
  };

  const calculateAverageGrade = () => {
    const gradeToValueMap = {
      A: 5,
      B: 4,
      C: 3,
      D: 2,
      E: 1,
    };

    let totalGradeValues = 0;
    let totalMarksObtained = 0;
    let totalSubjects = 0;

    // Check if there are subjects with valid grades
    const subjectsWithGrades = studentData?.filter(
      (score) => score?.marksObtained !== undefined
    );

    if (!subjectsWithGrades || subjectsWithGrades.length === 0) {
      console.log("No subjects with valid grades found.");
      return "N/A";
    }

    subjectsWithGrades.forEach((score) => {
      const gradeValue = gradeToValueMap[calculateGrade(score?.comment)];
      const marksObtained = score?.marksObtained;

      if (
        !isNaN(gradeValue) &&
        gradeValue !== undefined &&
        !isNaN(marksObtained) &&
        marksObtained !== undefined
      ) {
        console.log("Grade Value:", gradeValue);
        console.log("Marks Obtained:", marksObtained);

        totalGradeValues += gradeValue;
        totalMarksObtained += marksObtained;
        totalSubjects += 1;
      }
    });

    console.log("Total Grade Values:", totalGradeValues);
    console.log("Total Marks Obtained:", totalMarksObtained);
    console.log("Total Subjects:", totalSubjects);

    if (
      totalMarksObtained === 0 ||
      totalGradeValues === 0 ||
      totalSubjects === 0
    ) {
      console.log("Unable to calculate average grade.");
      return "N/A";
    }

    const averageGradeValue = totalGradeValues / totalSubjects;

    console.log("Average Grade Value:", averageGradeValue);

    if (isNaN(averageGradeValue)) {
      console.log("Average grade value is NaN.");
      return "N/A";
    }

    return averageGradeValue.toFixed(2);
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Box width="100%" overflow="auto">
          <button onClick={handlePrint}>Print this out!</button>
          <div className="comp" ref={componentRef}>
            <div
              className="header"
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f0f0f0",
              }}
            >
              <div className="logo">
                <img
                  src={`https://edupros.s3.amazonaws.com/${accountSettings.schoolLogo}`}
                  style={{
                    width: "200px",
                    height: "180px",
                  }}
                  alt="School Logo"
                />
              </div>
              <div className="bd_title">
                <h1
                  style={{
                    fontSize: "25px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    margin: "10px 0",
                  }}
                >
                  {accountSettings.name || ""}
                </h1>
                <h4 style={{ fontSize: "18px", margin: "5px 0" }}>
                  {accountSettings.address || ""}
                </h4>
                <p style={{ color: "#042954", margin: "5px 0" }}>
                  Tel: {accountSettings.phone || ""},{" "}
                  {accountSettings.phonetwo || ""}, Email:{" "}
                  {accountSettings.email || ""}
                </p>
                <h3 style={{ color: "#042954", margin: "10px 0" }}>
                  {data?.classname || ""} First Term Report Card
                </h3>
              </div>
            </div>

            {/*} <div
              className="bd_detailssec"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "0 0 auto" }}>
                <div className="bd_photo">
                  <img
                    className="profile-photo"
                    alt="profile-photo"
                    src="https://hlhs.portalreport.org/uploads/user.jpg"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <div
                style={{ flex: "1", padding: "0 20px", textAlign: "center" }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <span>Student Name:</span>
                  {""}
                  <span
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                  >
                    {data && Array.isArray(data) && data.length > 0
                      ? data[0]?.studentName || "Name not available"
                      : "Data format unexpected"}
                  </span>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <span>Session:</span>{" "}
                  <p
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                  >
                    {currentSession?.name
                      ? `${currentSession.name}`
                      : "No active session"}
                  </p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <span>Class Teacher:</span>{" "}
                  <span
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                  >
                    {data?.[0]?.teacherName || "Teacher not available"}
                  </span>
                </div>
              </div>
              <div
                style={{ flex: "1", padding: "0 20px", textAlign: "center" }}
              >
                <p style={{ color: "#042954" }}>
                  <span>Student Id No:</span>{" "}
                  <input
                    type="text"
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                    value={data?.[0]?.AdmNo || "ID not available"}
                    readOnly
                  />
                </p>
                <p style={{ color: "#042954" }}>
                  <span>Total Marks:</span>{" "}
                  <input
                    type="text"
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                    value={totalMarks || "0"}
                    readOnly
                  />
                </p>
              </div>
              <div
                style={{ flex: "1", padding: "0 20px", textAlign: "center" }}
              >
                <p style={{ color: "#042954" }}>
                  <span>Marks Obtained:</span>{" "}
                  <input
                    type="text"
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                    value={totalMarksObtained || "0"}
                    readOnly
                  />
                </p>
                <p style={{ color: "#042954" }}>
                  <span>Average Marks:</span>{" "}
                  <input
                    type="text"
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                    value={averageMarks || "0"}
                    readOnly
                  />
                </p>
                <p style={{ color: "#042954" }}>
                  <span>Average Grade:</span>{" "}
                  <input
                    type="text"
                    style={{
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      borderBottom: "1px solid black",
                      width: "50%",
                      marginLeft: "30px",
                      textAlign: "center",
                    }}
                    value={calculateAverageGrade() || "N/A"}
                    readOnly
                  />
                </p>
              </div>
            </div>*/}
            <div className="bd_detailssec" style={{ padding: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  border: "1px solid #000",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "10px",
                        borderRight: "2px solid #000",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                    >
                      <img
                        className="profile-photo"
                        alt="profile-photo"
                        src="https://hlhs.portalreport.org/uploads/user.jpg"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          border: "2px solid #000",
                        }}
                      />
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderRight: "2px solid #000",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Student Name:
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "200px",
                          }}
                        >
                          {Array.isArray(data) && data.length > 0
                            ? data[0]?.studentName || "Name not available"
                            : "Data format unexpected"}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>Student ID:</span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "100px",
                          }}
                        >
                          {data && data.length > 0
                            ? data[0]?.AdmNo || "ID not available"
                            : "Data format unexpected"}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>Session:</span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "200px",
                          }}
                        >
                          {accountSettings.sessionStart}-
                          {accountSettings.sessionEnd}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Class Teacher:
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "200px",
                          }}
                        >
                          Mrs Adebisi Emmanuel
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>Total Marks:</span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "100px",
                          }}
                        >
                          {totalMarks || "0"}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Marks Obtained:
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "100px",
                          }}
                        >
                          {totalMarksObtained || "0"}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Average Marks:
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "100px",
                          }}
                        >
                          {averageMarks || "0"}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Average Grade:
                        </span>
                        <span
                          style={{
                            marginLeft: "10px",
                            borderBottom: "1px solid black",
                            display: "inline-block",
                            paddingBottom: "2px",
                            minWidth: "100px",
                          }}
                        >
                          {calculateAverageGrade() || "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tables-container flex">
              {/* First Table */}
              <table className="table" id="customers" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>S/No</th>
                    <th>Subject</th>
                    <th>Test</th>
                    <th>Exam</th>
                    <th>Obtained Marks</th>
                    <th>Position</th>
                    <th>Grade</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody style={{ width: "100% !important" }}>
                  {/* Check if there's data and map through the scores */}
                  {studentData && studentData.length > 0 ? (
                    studentData.map((score, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td> {/* Serial number */}
                        <td>{score?.subjectName || "-"}</td>{" "}
                        {/* Subject Name */}
                        <td>
                          {score?.testscore !== undefined
                            ? score.testscore
                            : "-"}
                        </td>{" "}
                        {/* Test Score */}
                        <td>
                          {score?.examscore !== undefined
                            ? score.examscore
                            : "-"}
                        </td>{" "}
                        {/* Exam Score */}
                        <td>
                          {score?.marksObtained !== undefined
                            ? score.marksObtained
                            : "-"}
                        </td>{" "}
                        {/* Obtained Marks */}
                        <td>
                          {score?.position !== undefined ? score.position : "-"}
                        </td>{" "}
                        {/* Position */}
                        <td>{calculateGrade(score?.comment) || "-"}</td>{" "}
                        {/* Grade */}
                        <td>{score?.comment || "-"}</td> {/* Comment/Remark */}
                      </tr>
                    ))
                  ) : (
                    // Fallback for when no data is available
                    <tr>
                      <td colSpan="8">No data available for this term.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Second Table */}
              <table
                className="table second-sub-table"
                id="customersreport"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan="3"
                      style={{ textAlign: "center", fontSize: "18px" }}
                    >
                      AFFECTIVE AND PSYCHOMOTOR REPORT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th></th>
                    <th>Work Habits</th>
                    <th>RATINGS</th>
                  </tr>

                  {psyData ? (
                    <React.Fragment>
                      <tr>
                        <td>1</td>
                        <td>Following Instruction</td>
                        <td>{psyData?.instruction || "0"}</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Working Independently</td>
                        <td>{psyData?.independently || "0"}</td>
                      </tr>
                      <tr>
                        <th></th>
                        <th>Behaviour</th>
                        <th>RATINGS</th>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>Punctuality</td>
                        <td>{psyData?.punctuality || "0"}</td>
                      </tr>
                      <tr>
                        <th></th>
                        <th>Communication</th>
                        <th>RATINGS</th>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td>Talking</td>
                        <td>{psyData?.talking || "0"}</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Eye Contact</td>
                        <td>{psyData?.eyecontact || "0"}</td>
                      </tr>
                    </React.Fragment>
                  ) : (
                    <tr>
                      <td colSpan="2">No Psychomotor available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ color: "#042954", fontSize: "16px" }}>
              KEY TO GRADES A (DISTINCTION)=70% &amp; ABOVE , C (CREDIT)=55-69%
              , P(PASS)=40-54% , F(FAIL)=BELOW 40%
            </div>
            <div className="remarksbox" style={{ padding: "10px 0" }}>
              <table className="table">
                <tbody>
                  {psyData ? (
                    <>
                      <tr>
                        <th>CLASS TEACHER'S REMARK</th>
                        <td colSpan="2">{psyData?.remarks || "No remarks"}</td>
                      </tr>

                      <tr>
                        <th>PRINCIPAL'S REMARK</th>
                        <td colSpan="2">
                          {psyData?.premarks || "No principal remarks"}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="2">No data available</td>
                    </tr>
                  )}
                  <tr>
                    <th>PRINCIPAL'S NAME</th>
                    <td>{schoolSettings?.principalName || "N/A"}</td>
                    <td style={{ textAlign: "right" }}>
                      <img
                        src={schoolSettings?.signature} // Use full URL directly
                        width="200"
                        alt="Principal Signature"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>SCHOOL RESUMES</th>
                    <td>
                      {schoolSettings.resumptionDate
                        ? new Date(
                            schoolSettings.resumptionDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="bd_key"
              style={{ color: "#042954", fontSize: "16px" }}
            >
              KEY TO RATINGS : 5 = Excellent , 4 = Good , 3 = Fair , 2 = Poor ,
              1 = Very Poor
            </div>

            <div className="bdftrtop">
              <div className="float-left text-right bdftrtopl">
                <span style={{ color: "#042954" }}>Seal of the Register</span>
              </div>
              <div className="float-right text-left bdftrtopr">
                <span style={{ color: "#042954" }}>Date</span>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </Box>
      </ContentBox>
    </Fragment>
  );
};

export default FirstTermRep;
