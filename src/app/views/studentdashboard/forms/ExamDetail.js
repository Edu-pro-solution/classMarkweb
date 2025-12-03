import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  FormControlLabel,
  Radio,
  RadioGroup,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import CameraFeed from "./CameraFeed";

import { SessionContext } from "../../../components/MatxLayout/Layout1/SessionContext";

const ExamDetail = () => {
  const { id } = useParams(); // Get the id parameter from the route
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});

  const [totalMark, setTotalMark] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const [remainingTime, setRemainingTime] = useState(0); // Initialize with 0 instead of null
  const [timerInterval, setTimerInterval] = useState(null);

  const [examFinished, setExamFinished] = useState(false);
  const { currentSession } = useContext(SessionContext);

  const apiUrl = process.env.REACT_APP_API_URL.trim();

  const navigate = useNavigate();

  const enterFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      // For Safari
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      // For IE11
      element.msRequestFullscreen();
    }
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !examFinished && remainingTime > 0) {
        console.log("Escape key pressed. Fullscreen mode will not exit.");
        event.preventDefault();
      }
    };

    if (showQuestions) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showQuestions, examFinished, remainingTime]);

  const handleKeyDown = (event) => {
    console.log("Key pressed:", event.key);
    console.log("Exam finished:", examFinished);
    console.log("Remaining time:", remainingTime);

    if (event.key === "Escape" && !examFinished && remainingTime > 0) {
      console.log("Escape key pressed. Fullscreen mode will not exit.");
      event.preventDefault();
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ... (previous code)

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // const handleCloseDialog = () => {
  //   setIsDialogOpen(false);
  // };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Navigate back to /student/dashboard/manage-online-exam
    navigate("/student/dashboard/manage-online-exam");
  };

  const handleLogout = () => {
    // Perform logout action here
    // For example, clear localStorage and navigate to login page
    localStorage.clear();
    navigate("/student/dashboard/manage-online-exam");
  };
  const startTimer = () => {
    if (!exam || !exam.fromTime || !exam.toTime) {
      console.error("Exam details are not available.");
      return;
    }

    const defaultDate = new Date(); // Get today's date
    const examStartTimeStr = `${defaultDate.toDateString()} ${exam.fromTime}`;
    const examEndTimeStr = `${defaultDate.toDateString()} ${exam.toTime}`;

    // Convert exam.fromTime to the correct format
    const examStartTime = new Date(
      examStartTimeStr.replace(/-/g, "/").replace("T", " ").replace("Z", "")
    );
    // Convert exam.toTime to the correct format
    const examEndTime = new Date(
      examEndTimeStr.replace(/-/g, "/").replace("T", " ").replace("Z", "")
    );

    console.log("Exam start time:", examStartTime);
    console.log("Exam end time:", examEndTime);

    let examDuration = 0;

    const currentTime = new Date();

    if (currentTime < examStartTime) {
      examDuration = (examEndTime - examStartTime) / 1000; // Convert milliseconds to seconds
    } else if (currentTime > examEndTime) {
      examDuration = 0; // Exam has ended
    } else {
      examDuration = (examEndTime - currentTime) / 1000; // Convert milliseconds to seconds
    }

    console.log("Exam duration:", examDuration); // Debugging output

    // Handle unexpected values for examDuration
    if (isNaN(examDuration) || examDuration < 0) {
      console.error("Invalid exam duration:", examDuration);
      return;
    }

    setRemainingTime(Math.floor(examDuration));

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          handleLogout(); // Logout when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timerInterval);
    };
  }, [exam]);
  // Event listeners to prevent navigation, context menu, and keyboard shortcuts

  const getLoggedInUserId = () => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken);
      return decodedToken.user._id;
    }
    return null;
  };

  // const fetchExamAndQuestions = async () => {
  //   try {
  //     const examResponse = await axios.get(
  //       `${apiUrl}/api/get-exam-by-id/${id}/${currentSession._id}`
  //     );
  //     const examData = examResponse.data;
  //     setExam(examData);

  //     // Fetch previously submitted answers
  //     const token = localStorage.getItem("jwtToken");
  //     const headers = { Authorization: `Bearer ${token}` };
  //     const submissionResponse = await axios.get(
  //       `${apiUrl}/api/exams/get-submission/${id}/${getLoggedInUserId()}`,
  //       { headers }
  //     );

  //     const userAnswers = submissionResponse.data.answers;
  //     console.log(userAnswers);
  //     setAnswers(userAnswers); // Populate the form with user's previous answers

  //     const questionsResponse = await axios.get(
  //       `${apiUrl}/api/questions/${id}`,
  //       { headers }
  //     );
  //     const questionsData = questionsResponse.data;
  //     setQuestions(questionsData);

  //     const correctAnswersData = {};
  //     questionsData.forEach((question) => {
  //       if (question.questionType === "true_false") {
  //         correctAnswersData[question._id] =
  //           question.correctAnswer.toLowerCase();
  //       } else {
  //         correctAnswersData[question._id] =
  //           question.options
  //             .find((option) => option.isCorrect)
  //             ?.option.toLowerCase() || "";
  //       }
  //     });

  //     setCorrectAnswers(correctAnswersData);
  //     setTotalMark(
  //       questionsData.reduce(
  //         (total, question) => total + parseInt(question.mark),
  //         0
  //       )
  //     );

  //     startTimer();
  //   } catch (error) {
  //     console.error("Error fetching exam or questions:", error);
  //   }
  // };

  // // useEffect(() => {
  // //   fetchExamAndQuestions();
  // // }, [id]);

  // useEffect(() => {
  //   fetchExamAndQuestions();
  //   return () => {
  //     clearInterval(timerInterval); // Clear the timer interval on component unmount
  //   };
  // }, [id]);

  const fetchExamAndQuestions = async () => {
    try {
      const examResponse = await axios.get(
        `${apiUrl}/api/get-exam-by-id/${id}/${currentSession._id}`
      );
      setExam(examResponse.data);
      // Set the exam object before calling startTimer
      console.log("Exam details:", examResponse.data);

      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const questionsResponse = await axios.get(
        `${apiUrl}/api/questions/${id}`,
        { headers }
      );
      const questionsData = questionsResponse.data;
      console.log("Fetched questions:", questionsData);

      const correctAnswersData = {};

      questionsData.forEach((question) => {
        if (question.questionType === "true_false") {
          correctAnswersData[question._id] =
            question.correctAnswer.toLowerCase(); // Convert to lowercase
        } else if (question.questionType === "theory") {
          // Handle theory questions
          // For theory questions, correctAnswer might not be available
          // You can set it to an empty string or handle it differently based on your requirements
          correctAnswersData[question._id] = "";
        } else {
          correctAnswersData[question._id] =
            question.options
              .find((option) => option.isCorrect)
              ?.option.toLowerCase() || "";
        }
      });
      console.log("Correct Answers Data:", correctAnswersData);
      setCorrectAnswers(correctAnswersData);

      setQuestions(questionsData);

      const calculatedTotalMark = questionsData.reduce(
        (total, question) => total + parseInt(question.mark),
        0
      );
      setTotalMark(calculatedTotalMark);
      startTimer();
    } catch (error) {
      console.error("Error fetching exam or questions:", error);
    }
  };

  // useEffect(() => {
  //   fetchExamAndQuestions();
  // }, [id]);

  useEffect(() => {
    fetchExamAndQuestions();
    return () => {
      clearInterval(timerInterval); // Clear the timer interval on component unmount
    };
  }, [id]);

  const calculateScore = () => {
    try {
      const calculatedScore = questions.reduce((totalScore, question) => {
        const questionId = question._id;
        const studentAnswer = answers[questionId] || "";
        const correctAnswer = correctAnswers[questionId] || "";
        let questionScore = 0;

        if (question.questionType === "fill_in_the_blanks") {
          // If it's a Fill In The Blanks question
          const possibleAnswers = new Set(
            question.possibleAnswers
              .flatMap((answers) => answers.toLowerCase().split(","))
              .map((answer) => answer.trim())
          );

          // Normalize student's answer
          const normalizedStudentAnswer = studentAnswer.toLowerCase().trim();

          // Check if the student's answer matches any of the possible answers
          if (possibleAnswers.has(normalizedStudentAnswer)) {
            questionScore = question.mark;
          }
        } else if (question.questionType === "theory") {
          // if (studentAnswer.trim() !== "") {
          //   questionScore = question.mark;
          // }

          questionScore = 0;
        } else {
          // For other question types (True/False, Multiple Choice)
          if (
            studentAnswer.toLowerCase().trim() ===
            correctAnswer.toLowerCase().trim()
          ) {
            questionScore = question.mark;
          }
        }

        return totalScore + questionScore;
      }, 0);

      setScore(calculatedScore);
      handleSubmitExam(calculatedScore);
    } catch (error) {
      console.error("Error calculating score:", error);
      // Handle any errors
    }
  };

  const handleSubmitExam = async (calculatedScore) => {
    try {
      console.log("Score before submitting:", calculatedScore); // Log the score before submitting

      const trimmedExamId = id.trim();
      const userId = getLoggedInUserId();

      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const data = {
        examId: trimmedExamId,
        answers: answers,
        userId: userId,
        score: calculatedScore,
      };

      console.log("Data before submitting:", data); // Log the data before submitting

      const response = await axios.post(
        `${apiUrl}/api/exams/submit/${currentSession._id}`,
        data,
        {
          headers,
        }
      );

      if (response.status === 200) {
        setExamFinished(true);
        // You can navigate to the dashboard or show a success message here
        // navigate("/student/dashboard/manage-online-exam");
      } else {
        console.error("Failed to submit the exam");
        // Handle the error or show an error message to the user.
      }
    } catch (error) {
      console.error("An error occurred while submitting the exam:", error);
      // Handle errors, e.g., network issues or other errors
    }
  };

  return (
    <div>
      <Typography variant="h5">Exam Details</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Exam Title</b>
              </TableCell>
              <TableCell>{exam ? exam.title : "Loading..."}</TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
              {/*<TableCell>{exam ? exam.date : "Loading..."}</TableCell>*/}
              <TableCell>
                {exam ? new Date(exam.date).toLocaleDateString() : "Loading..."}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Class</b>
              </TableCell>
              <TableCell>{exam ? exam.className : "Loading..."}</TableCell>
              <TableCell>
                <b>Time</b>
              </TableCell>
              <TableCell>
                {exam ? `${exam.fromTime} - ${exam.toTime}` : "Loading..."}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Exam Instruction</b>
              </TableCell>
              <TableCell>{exam ? exam.instruction : "Loading..."}</TableCell>
              <TableCell>
                <b>Total Mark</b>
              </TableCell>
              <TableCell>{exam ? exam?.totalMark : "Loading..."}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/*} <CameraFeed />*/}
      <Typography
        variant="h6"
        style={{
          backgroundColor: "#f0f0f0",
          padding: "8px",
          borderRadius: "4px",
          fontSize: "2rem",
          color: "#ff0000",
        }}
      >
        Time Remaining: {formatTime(remainingTime)}
      </Typography>

      <Button
        onClick={() => {
          setShowQuestions(true);
          enterFullscreen();
        }}
      >
        Start Exam
      </Button>
      {showQuestions && (
        <div>
          <Grid container spacing={2}>
            {questions.map((question, index) => (
              <Grid item xs={12} key={question._id}>
                <Card>
                  <CardContent>
                    {/* <Typography variant="h6">{`Question ${index + 1}: ${
                      question.questionTitle
                    }`}</Typography> */}


                        <Typography variant="h6">{`Question ${index + 1}:`}</Typography>
              <div
                dangerouslySetInnerHTML={{ __html: question.questionTitle }}
                style={{ overflow: "hidden",   maxHeight: "400px"  }}
                className="student-question-content"
              />

                    {question.options && question.options.length > 0 && (
                      <div>
                        <RadioGroup
                          name={`question_${question._id}`}
                          value={answers[question._id] || ""}
                          onChange={(e) =>
                            handleOptionChange(question._id, e.target.value)
                          }
                        >
                          {question.options.map((option, optionIndex) => (
                            <FormControlLabel
                              key={optionIndex}
                              value={option.option}
                              control={<Radio />}
                              label={option.option}
                            />
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                    {question.questionType === "true_false" && (
                      <div>
                        <Typography variant="subtitle1">
                          True or False:
                        </Typography>
                        <RadioGroup
                          name={`question_${question._id}`}
                          value={answers[question._id] || ""}
                          onChange={(e) =>
                            handleOptionChange(question._id, e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="True"
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            value="False"
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                      </div>
                    )}

                    {question.questionType === "fill_in_the_blanks" && (
                      <div>
                        <Typography variant="subtitle1">
                          Fill in the blank:
                        </Typography>
                        <TextField
                          name={`question_${question._id}`}
                          value={answers[question._id] || ""}
                          onChange={(e) =>
                            handleOptionChange(question._id, e.target.value)
                          }
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          label="Your Answer"
                          placeholder="Type your answer here"
                        />
                      </div>
                    )}

                    {question.questionType === "theory" && (
                      <div>
                        <Typography variant="subtitle1">
                          Theory Question:
                        </Typography>
                        <TextField
                          name={`question_${question._id}`}
                          value={answers[question._id] || ""}
                          onChange={(e) =>
                            handleOptionChange(question._id, e.target.value)
                          }
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          label="Your Answer"
                          placeholder="Type your answer here"
                          multiline // Allow multiline input for theory questions
                          rows={4} // Set the number of rows for multiline input
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" color="primary" onClick={calculateScore}>
            Submit Exam
          </Button>
        </div>
      )}

      <Dialog open={examFinished} onClose={handleCloseDialog}>
        <DialogTitle>Exam Completed</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have successfully completed the exam. Thank you!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export default ExamDetail;
