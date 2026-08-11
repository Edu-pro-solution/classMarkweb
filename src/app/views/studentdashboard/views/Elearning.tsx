// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { SessionContext } from "@/contexts/SessionContext";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, BookOpen, ExternalLink, FileText, GraduationCap } from "lucide-react";

// type Course = {
//   _id: string;
//   title: string;
//   code?: string;
//   description?: string;
//   department?: string;
//   teacherName?: string;
//   isEnrolled?: boolean;
// };

// type Lecture = {
//   _id: string;
//   title: string;
//   description?: string;
//   resourceType: "link" | "file";
//   url: string;
//   fileName?: string;
// };

// export default function ELearning() {
//   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//   const { currentSession } = useContext(SessionContext);

//   const [allCourses, setAllCourses] = useState<Course[]>([]);
//   const [myCourses, setMyCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [enrollingId, setEnrollingId] = useState<string | null>(null);

//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [lectures, setLectures] = useState<Lecture[]>([]);
//   const [loadingLectures, setLoadingLectures] = useState(false);

//   const authHeaders = () => {
//     const token = localStorage.getItem("jwtToken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const loadCourses = async () => {
//     if (!currentSession?._id) return;
//     try {
//       setLoading(true);
//       const [browseRes, enrolledRes] = await Promise.all([
//         axios.get(`${apiUrl}/api/elearning/courses`, {
//           headers: authHeaders(),
//           params: { sessionId: currentSession._id },
//         }),
//         axios.get(`${apiUrl}/api/elearning/enrollments`, { headers: authHeaders() }),
//       ]);
//       setAllCourses(Array.isArray(browseRes.data) ? browseRes.data : []);
//       setMyCourses(Array.isArray(enrolledRes.data) ? enrolledRes.data : []);
//     } catch (error) {
//       console.error("loadCourses error:", error);
//       toast.error("Failed to load courses.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadCourses();
//   }, [currentSession?._id]);

//   const register = async (course: Course) => {
//     try {
//       setEnrollingId(course._id);
//       await axios.post(
//         `${apiUrl}/api/elearning/courses/${course._id}/enroll`,
//         {},
//         { headers: authHeaders() }
//       );
//       toast.success(`Registered for ${course.title}.`);
//       loadCourses();
//     } catch (error: any) {
//       console.error("register error:", error);
//       toast.error(error?.response?.data?.message || "Failed to register for course.");
//     } finally {
//       setEnrollingId(null);
//     }
//   };

//   const openLectures = async (course: Course) => {
//     setSelectedCourse(course);
//     try {
//       setLoadingLectures(true);
//       const response = await axios.get(`${apiUrl}/api/elearning/courses/${course._id}/lectures`, {
//         headers: authHeaders(),
//       });
//       setLectures(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("loadLectures error:", error);
//       toast.error("Failed to load lectures for this course.");
//     } finally {
//       setLoadingLectures(false);
//     }
//   };

//   if (selectedCourse) {
//     return (
//       <div className="space-y-6 p-4">
//         <Button
//           variant="ghost"
//           onClick={() => {
//             setSelectedCourse(null);
//             setLectures([]);
//           }}
//           className="text-slate-500 hover:text-[#004aaa] gap-2">
//           <ArrowLeft size={16} /> Back to My Courses
//         </Button>

//         <div>
//           <h2 className="text-2xl font-bold text-[#004aaa]">{selectedCourse.title}</h2>
//           <p className="text-sm text-slate-500">
//             {selectedCourse.code ? `${selectedCourse.code} · ` : ""}
//             {selectedCourse.teacherName}
//           </p>
//         </div>

//         {loadingLectures ? (
//           <p className="text-sm text-muted-foreground">Loading lectures…</p>
//         ) : lectures.length === 0 ? (
//           <Card className="border shadow-sm">
//             <CardContent className="p-6">
//               <p className="text-sm text-muted-foreground">
//                 No lectures have been posted for this course yet.
//               </p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-3">
//             {lectures.map((lecture) => (
//               <Card key={lecture._id} className="border shadow-sm">
//                 <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                   <div>
//                     <h3 className="font-bold text-black">{lecture.title}</h3>
//                     {lecture.description && (
//                       <p className="text-sm text-slate-600 mt-1">{lecture.description}</p>
//                     )}
//                   </div>
//                   <Button asChild className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 shrink-0">
//                     <a href={lecture.url} target="_blank" rel="noopener noreferrer">
//                       {lecture.resourceType === "link" ? (
//                         <ExternalLink size={14} />
//                       ) : (
//                         <FileText size={14} />
//                       )}
//                       {lecture.resourceType === "link" ? "Watch Lecture" : "Open Material"}
//                     </a>
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4">
//       <div>
//         <h2 className="text-2xl font-bold text-[#004aaa]">E-Learning</h2>
//         <p className="text-sm text-muted-foreground">
//           Register for courses and access your lectures and materials from home.
//         </p>
//       </div>

//       <Tabs defaultValue="mycourses">
//         <TabsList>
//           <TabsTrigger value="mycourses">My Courses</TabsTrigger>
//           <TabsTrigger value="browse">Browse & Register</TabsTrigger>
//         </TabsList>

//         <TabsContent value="mycourses" className="space-y-3 pt-4">
//           {loading ? (
//             <p className="text-sm text-muted-foreground">Loading…</p>
//           ) : myCourses.length === 0 ? (
//             <Card className="border shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-sm text-muted-foreground">
//                   You haven't registered for any courses yet. Switch to "Browse & Register" to get started.
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             myCourses.map((course) => (
//               <Card key={course._id} className="border shadow-sm">
//                 <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="mt-0.5 h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//                       <GraduationCap className="h-4 w-4 text-[#004aaa]" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-black">{course.title}</h3>
//                       <p className="text-sm text-slate-500">
//                         {course.code ? `${course.code} · ` : ""}
//                         {course.teacherName}
//                       </p>
//                     </div>
//                   </div>
//                   <Button onClick={() => openLectures(course)} className="bg-[#004aaa] hover:bg-[#004aaa]/90 shrink-0">
//                     View Lectures
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         <TabsContent value="browse" className="space-y-3 pt-4">
//           {loading ? (
//             <p className="text-sm text-muted-foreground">Loading…</p>
//           ) : allCourses.length === 0 ? (
//             <Card className="border shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-sm text-muted-foreground">No courses are available yet.</p>
//               </CardContent>
//             </Card>
//           ) : (
//             allCourses.map((course) => (
//               <Card key={course._id} className="border shadow-sm">
//                 <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="mt-0.5 h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
//                       <BookOpen className="h-4 w-4 text-[#004aaa]" />
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-black">{course.title}</h3>
//                       <p className="text-sm text-slate-500">
//                         {course.code ? `${course.code} · ` : ""}
//                         {course.teacherName}
//                         {course.department ? ` · ${course.department}` : ""}
//                       </p>
//                       {course.description && (
//                         <p className="text-sm text-slate-600 mt-1">{course.description}</p>
//                       )}
//                     </div>
//                   </div>
//                   {course.isEnrolled ? (
//                     <Button disabled variant="outline" className="shrink-0">
//                       Registered
//                     </Button>
//                   ) : (
//                     <Button
//                       onClick={() => register(course)}
//                       disabled={enrollingId === course._id}
//                       className="bg-[#004aaa] hover:bg-[#004aaa]/90 shrink-0">
//                       {enrollingId === course._id ? "Registering..." : "Register"}
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SessionContext } from "@/contexts/SessionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, ExternalLink, FileText, GraduationCap, User } from "lucide-react";

type Course = {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  department?: string;
  thumbnailUrl?: string;
  teacherName?: string;
  isEnrolled?: boolean;
};

type Lecture = {
  _id: string;
  title: string;
  description?: string;
  resourceType: "link" | "file";
  url: string;
};

function CourseThumb({ course, className = "" }: { course: Course; className?: string }) {
  if (course.thumbnailUrl) {
    return (
      <div
        className={`bg-cover bg-center ${className}`}
        style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
      />
    );
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-[#004aaa] to-[#00366e] ${className}`}>
      <BookOpen className="text-white/70" size={32} />
    </div>
  );
}

export default function ELearning() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { currentSession } = useContext(SessionContext);

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCourses = async () => {
    if (!currentSession?._id) return;
    try {
      setLoading(true);
      const [browseRes, enrolledRes] = await Promise.all([
        axios.get(`${apiUrl}/api/elearning/courses`, {
          headers: authHeaders(),
          params: { sessionId: currentSession._id },
        }),
        axios.get(`${apiUrl}/api/elearning/enrollments`, { headers: authHeaders() }),
      ]);
      setAllCourses(Array.isArray(browseRes.data) ? browseRes.data : []);
      setMyCourses(Array.isArray(enrolledRes.data) ? enrolledRes.data : []);
    } catch (error) {
      console.error("loadCourses error:", error);
      toast.error("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentSession?._id]);

  const register = async (course: Course) => {
    try {
      setEnrollingId(course._id);
      await axios.post(
        `${apiUrl}/api/elearning/courses/${course._id}/enroll`,
        {},
        { headers: authHeaders() }
      );
      toast.success(`Registered for ${course.title}.`);
      loadCourses();
    } catch (error: any) {
      console.error("register error:", error);
      toast.error(error?.response?.data?.message || "Failed to register for course.");
    } finally {
      setEnrollingId(null);
    }
  };

  const openCourse = async (course: Course) => {
    setSelectedCourse(course);
    try {
      setLoadingLectures(true);
      const response = await axios.get(`${apiUrl}/api/elearning/courses/${course._id}/lectures`, {
        headers: authHeaders(),
      });
      setLectures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("loadLectures error:", error);
      toast.error("Failed to load lectures for this course.");
    } finally {
      setLoadingLectures(false);
    }
  };

  // ── Course Detail ────────────────────────────────────────────────────
  if (selectedCourse) {
    return (
      <div className="space-y-6 p-4">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedCourse(null);
            setLectures([]);
          }}
          className="text-slate-500 hover:text-[#004aaa] gap-2">
          <ArrowLeft size={16} /> Back to Courses
        </Button>

        <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
          <CourseThumb course={selectedCourse} className="h-52 w-full" />
          <CardContent className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-[#004aaa]">
              {selectedCourse.code || "Course"} {selectedCourse.department ? `· ${selectedCourse.department}` : ""}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-black">{selectedCourse.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <User size={14} /> {selectedCourse.teacherName}
            </div>
            {selectedCourse.description && (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{selectedCourse.description}</p>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-lg font-bold text-[#004aaa]">Lectures & Materials</h2>
          {loadingLectures ? (
            <p className="text-sm text-muted-foreground">Loading lectures…</p>
          ) : lectures.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  No lectures have been posted for this course yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture) => (
                <Card key={lecture._id} className="border shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold text-black">{lecture.title}</h3>
                      {lecture.description && (
                        <p className="text-sm text-slate-600 mt-1">{lecture.description}</p>
                      )}
                    </div>
                    <Button asChild className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 shrink-0">
                      <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                        {lecture.resourceType === "link" ? (
                          <ExternalLink size={14} />
                        ) : (
                          <FileText size={14} />
                        )}
                        {lecture.resourceType === "link" ? "Watch Lecture" : "Open Material"}
                      </a>
                     
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Browse / My Courses ─────────────────────────────────────────────
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-2xl font-bold text-[#004aaa]">E-Learning</h2>
        <p className="text-sm text-muted-foreground">
          Register for courses and access your lectures and materials from home.
        </p>
      </div>

      <Tabs defaultValue="mycourses">
        <TabsList>
          <TabsTrigger value="mycourses">My Courses</TabsTrigger>
          <TabsTrigger value="browse">Browse & Register</TabsTrigger>
        </TabsList>

        <TabsContent value="mycourses" className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : myCourses.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  You haven't registered for any courses yet. Switch to "Browse & Register" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {myCourses.map((course) => (
                <Card
                  key={course._id}
                  className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                  <CourseThumb course={course} className="h-32 w-full" />
                  <CardContent className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#004aaa]">
                      {course.code || "Course"}
                    </p>
                    <h3 className="mt-1 font-bold text-black line-clamp-1">{course.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <GraduationCap size={12} /> {course.teacherName}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => openCourse(course)}
                      className="mt-3 w-full bg-[#004aaa] hover:bg-[#004aaa]/90">
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="browse" className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : allCourses.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">No courses are available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {allCourses.map((course) => (
                <Card
                  key={course._id}
                  className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
                  <CourseThumb course={course} className="h-32 w-full" />
                  <CardContent className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#004aaa]">
                      {course.code || "Course"} {course.department ? `· ${course.department}` : ""}
                    </p>
                    <h3 className="mt-1 font-bold text-black line-clamp-1">{course.title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <GraduationCap size={12} /> {course.teacherName}
                    </div>
                    {course.description && (
                      <p className="mt-2 text-xs text-slate-500 line-clamp-2">{course.description}</p>
                    )}
                    {course.isEnrolled ? (
                      <Button size="sm" disabled variant="outline" className="mt-3 w-full">
                        Registered
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => register(course)}
                        disabled={enrollingId === course._id}
                        className="mt-3 w-full bg-[#004aaa] hover:bg-[#004aaa]/90">
                        {enrollingId === course._id ? "Registering..." : "Register"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
