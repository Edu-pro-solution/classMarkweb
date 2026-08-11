// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { SessionContext } from "@/contexts/SessionContext";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { FormShell } from "@/components/ActionForm";
// import { ArrowLeft, BookOpen, ExternalLink, FileText, Plus } from "lucide-react";

// type Course = {
//   _id: string;
//   title: string;
//   code?: string;
//   description?: string;
//   department?: string;
//   createdAt?: string;
// };

// type Lecture = {
//   _id: string;
//   title: string;
//   description?: string;
//   resourceType: "link" | "file";
//   url: string;
//   fileName?: string;
//   createdAt?: string;
// };

// export default function TLearning() {
//   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
//   const { currentSession } = useContext(SessionContext);

//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loadingCourses, setLoadingCourses] = useState(false);

//   const [view, setView] = useState<"list" | "addCourse" | "lectures">("list");
//   const [savingCourse, setSavingCourse] = useState(false);

//   const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
//   const [lectures, setLectures] = useState<Lecture[]>([]);
//   const [loadingLectures, setLoadingLectures] = useState(false);
//   const [addingLecture, setAddingLecture] = useState(false);
//   const [showAddLecture, setShowAddLecture] = useState(false);

//   const [courseForm, setCourseForm] = useState({ title: "", code: "", department: "", description: "" });
//   const [lectureForm, setLectureForm] = useState({ title: "", description: "", externalUrl: "" });
//   const [lectureFile, setLectureFile] = useState<File | null>(null);

//   const authHeaders = () => {
//     const token = localStorage.getItem("jwtToken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const loadCourses = async () => {
//     if (!currentSession?._id) return;
//     try {
//       setLoadingCourses(true);
//       const response = await axios.get(`${apiUrl}/api/elearning/courses`, {
//         headers: authHeaders(),
//         params: { sessionId: currentSession._id, mine: "true" },
//       });
//       setCourses(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("loadCourses error:", error);
//       toast.error("Failed to load your courses.");
//     } finally {
//       setLoadingCourses(false);
//     }
//   };

//   useEffect(() => {
//     loadCourses();
//   }, [currentSession?._id]);

//   const createCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!currentSession?._id) {
//       toast.error("No active session found.");
//       return;
//     }
//     if (!courseForm.title.trim()) {
//       toast.error("Course title is required.");
//       return;
//     }

//     try {
//       setSavingCourse(true);
//       await axios.post(
//         `${apiUrl}/api/elearning/courses`,
//         { ...courseForm, session: currentSession._id },
//         { headers: authHeaders() }
//       );
//       toast.success("Course created.");
//       setCourseForm({ title: "", code: "", department: "", description: "" });
//       setView("list");
//       loadCourses();
//     } catch (error) {
//       console.error("createCourse error:", error);
//       toast.error("Failed to create course.");
//     } finally {
//       setSavingCourse(false);
//     }
//   };

//   const openLectures = async (course: Course) => {
//     setSelectedCourse(course);
//     setView("lectures");
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

//   const addLecture = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCourse) return;
//     if (!lectureForm.title.trim()) {
//       toast.error("Lecture title is required.");
//       return;
//     }
//     if (!lectureFile && !lectureForm.externalUrl.trim()) {
//       toast.error("Attach a file or paste a lecture link.");
//       return;
//     }

//     try {
//       setAddingLecture(true);
//       const payload = new FormData();
//       payload.append("title", lectureForm.title);
//       payload.append("description", lectureForm.description);
//       if (lectureForm.externalUrl.trim()) payload.append("externalUrl", lectureForm.externalUrl.trim());
//       if (lectureFile) payload.append("attachment", lectureFile);

//       await axios.post(`${apiUrl}/api/elearning/courses/${selectedCourse._id}/lectures`, payload, {
//         headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
//       });

//       toast.success("Lecture added.");
//       setLectureForm({ title: "", description: "", externalUrl: "" });
//       setLectureFile(null);
//       setShowAddLecture(false);
//       openLectures(selectedCourse);
//     } catch (error) {
//       console.error("addLecture error:", error);
//       toast.error("Failed to add lecture.");
//     } finally {
//       setAddingLecture(false);
//     }
//   };

//   if (view === "addCourse") {
//     return (
//       <div className="p-6 space-y-6">
//         <Button
//           variant="ghost"
//           onClick={() => setView("list")}
//           className="text-slate-500 hover:text-[#004aaa] gap-2">
//           <ArrowLeft size={16} /> Back to My Courses
//         </Button>

//         <FormShell title="Course" type="add" loading={savingCourse} onSubmit={createCourse}>
//           <div className="space-y-2">
//             <Label className="text-[10px] font-bold uppercase text-slate-400">Course Title</Label>
//             <Input
//               value={courseForm.title}
//               onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
//               placeholder="e.g. Introduction to Programming"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-[10px] font-bold uppercase text-slate-400">Course Code</Label>
//             <Input
//               value={courseForm.code}
//               onChange={(e) => setCourseForm((prev) => ({ ...prev, code: e.target.value }))}
//               placeholder="e.g. CSC201"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label className="text-[10px] font-bold uppercase text-slate-400">Department</Label>
//             <Input
//               value={courseForm.department}
//               onChange={(e) => setCourseForm((prev) => ({ ...prev, department: e.target.value }))}
//               placeholder="e.g. Computer Science"
//             />
//           </div>

//           <div className="space-y-2 md:col-span-2">
//             <Label className="text-[10px] font-bold uppercase text-slate-400">Description</Label>
//             <Textarea
//               value={courseForm.description}
//               onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
//               placeholder="What this course covers..."
//               className="min-h-[100px] resize-none"
//             />
//           </div>
//         </FormShell>
//       </div>
//     );
//   }

//   if (view === "lectures" && selectedCourse) {
//     return (
//       <div className="p-6 space-y-6">
//         <Button
//           variant="ghost"
//           onClick={() => {
//             setView("list");
//             setSelectedCourse(null);
//             setLectures([]);
//           }}
//           className="text-slate-500 hover:text-[#004aaa] gap-2">
//           <ArrowLeft size={16} /> Back to My Courses
//         </Button>

//         <div className="flex items-center justify-between gap-4 flex-wrap">
//           <div>
//             <h2 className="text-2xl font-bold text-[#004aaa]">{selectedCourse.title}</h2>
//             {selectedCourse.code && <p className="text-sm text-slate-500">{selectedCourse.code}</p>}
//           </div>
//           <Button
//             onClick={() => setShowAddLecture(true)}
//             className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 font-semibold">
//             <Plus size={16} /> Add Lecture / Material
//           </Button>
//         </div>

//         {showAddLecture && (
//           <FormShell
//             title="Lecture"
//             type="add"
//             loading={addingLecture}
//             onSubmit={addLecture}
//             onClose={() => setShowAddLecture(false)}>
//             <div className="space-y-2">
//               <Label className="text-[10px] font-bold uppercase text-slate-400">Lecture Title</Label>
//               <Input
//                 value={lectureForm.title}
//                 onChange={(e) => setLectureForm((prev) => ({ ...prev, title: e.target.value }))}
//                 placeholder="e.g. Week 1 — Variables and Data Types"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label className="text-[10px] font-bold uppercase text-slate-400">
//                 Lecture Link (YouTube, Zoom recording, etc.)
//               </Label>
//               <Input
//                 value={lectureForm.externalUrl}
//                 onChange={(e) => setLectureForm((prev) => ({ ...prev, externalUrl: e.target.value }))}
//                 placeholder="https://..."
//               />
//             </div>

//             <div className="space-y-2 md:col-span-2">
//               <Label className="text-[10px] font-bold uppercase text-slate-400">
//                 Or upload a file (slides, PDF, recorded video)
//               </Label>
//               <Input
//                 type="file"
//                 onChange={(e) => setLectureFile(e.target.files?.[0] ? e.target.files[0] : null)}
//               />
//             </div>

//             <div className="space-y-2 md:col-span-2">
//               <Label className="text-[10px] font-bold uppercase text-slate-400">Description</Label>
//               <Textarea
//                 value={lectureForm.description}
//                 onChange={(e) => setLectureForm((prev) => ({ ...prev, description: e.target.value }))}
//                 placeholder="Notes about this lecture..."
//                 className="min-h-[90px] resize-none"
//               />
//             </div>
//           </FormShell>
//         )}

//         <Card className="border-none shadow-sm overflow-hidden ring-1 ring-slate-200">
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader className="bg-[#E8EBF3]">
//                 <TableRow>
//                   <TableHead className="text-[#004aaa] font-bold pl-6">Title</TableHead>
//                   <TableHead className="text-[#004aaa] font-bold">Type</TableHead>
//                   <TableHead className="text-[#004aaa] font-bold">Description</TableHead>
//                   <TableHead className="text-right text-[#004aaa] font-bold pr-6">Resource</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loadingLectures ? (
//                   <TableRow>
//                     <TableCell colSpan={4} className="py-12 text-center text-slate-500">
//                       Loading lectures…
//                     </TableCell>
//                   </TableRow>
//                 ) : lectures.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={4} className="py-12 text-center text-slate-500">
//                       No lectures added yet.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   lectures.map((lecture) => (
//                     <TableRow key={lecture._id} className="hover:bg-slate-50/50">
//                       <TableCell className="pl-6 font-bold text-[#004aaa]">{lecture.title}</TableCell>
//                       <TableCell className="text-slate-600 capitalize">{lecture.resourceType}</TableCell>
//                       <TableCell className="text-slate-500 text-sm">{lecture.description || "—"}</TableCell>
//                       <TableCell className="text-right pr-6">
//                         <Button size="sm" asChild className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 h-8 px-4">
//                           <a href={lecture.url} target="_blank" rel="noopener noreferrer">
//                             {lecture.resourceType === "link" ? (
//                               <ExternalLink size={14} />
//                             ) : (
//                               <FileText size={14} />
//                             )}
//                             Open
//                           </a>
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4">
//       <div className="flex items-center justify-between gap-4 flex-wrap">
//         <h2 className="text-2xl font-bold text-[#004aaa]">My Courses</h2>
//         <Button
//           onClick={() => setView("addCourse")}
//           className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 font-semibold">
//           <Plus size={16} /> Create Course
//         </Button>
//       </div>

//       <Card className="border-none shadow-sm overflow-hidden ring-1 ring-slate-200">
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-[#E8EBF3]">
//               <TableRow>
//                 <TableHead className="text-[#004aaa] font-bold pl-6">Title</TableHead>
//                 <TableHead className="text-[#004aaa] font-bold">Code</TableHead>
//                 <TableHead className="text-[#004aaa] font-bold">Department</TableHead>
//                 <TableHead className="text-right text-[#004aaa] font-bold pr-6">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loadingCourses ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="py-12 text-center text-slate-500">
//                     Loading courses…
//                   </TableCell>
//                 </TableRow>
//               ) : courses.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="py-12 text-center text-slate-500">
//                     You haven't created any courses yet.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 courses.map((course) => (
//                   <TableRow key={course._id} className="hover:bg-slate-50/50">
//                     <TableCell className="pl-6 font-bold text-[#004aaa]">
//                       <div className="flex items-center gap-2">
//                         <BookOpen size={14} className="text-blue-500" />
//                         {course.title}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-slate-600">{course.code || "—"}</TableCell>
//                     <TableCell className="text-slate-600">{course.department || "—"}</TableCell>
//                     <TableCell className="text-right pr-6">
//                       <Button size="sm" variant="outline" onClick={() => openLectures(course)}>
//                         Manage Lectures
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { SessionContext } from "@/contexts/SessionContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormShell } from "@/components/ActionForm";
import { ArrowLeft, BookOpen, ExternalLink, FileText, ImagePlus, Plus } from "lucide-react";

type Course = {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  department?: string;
  thumbnailUrl?: string;
  createdAt?: string;
};

type Lecture = {
  _id: string;
  title: string;
  description?: string;
  resourceType: "link" | "file";
  url: string;
  fileName?: string;
  createdAt?: string;
};

export default function TLearning() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { currentSession } = useContext(SessionContext);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [view, setView] = useState<"list" | "addCourse" | "lectures">("list");
  const [savingCourse, setSavingCourse] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [addingLecture, setAddingLecture] = useState(false);
  const [showAddLecture, setShowAddLecture] = useState(false);

  const [courseForm, setCourseForm] = useState({ title: "", code: "", department: "", description: "" });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const [lectureForm, setLectureForm] = useState({ title: "", description: "", externalUrl: "" });
  const [lectureFile, setLectureFile] = useState<File | null>(null);

  const authHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadCourses = async () => {
    if (!currentSession?._id) return;
    try {
      setLoadingCourses(true);
      const response = await axios.get(`${apiUrl}/api/elearning/courses`, {
        headers: authHeaders(),
        params: { sessionId: currentSession._id, mine: "true" },
      });
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("loadCourses error:", error);
      toast.error("Failed to load your courses.");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentSession?._id]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnailFile]);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession?._id) {
      toast.error("No active session found.");
      return;
    }
    if (!courseForm.title.trim()) {
      toast.error("Course title is required.");
      return;
    }

    try {
      setSavingCourse(true);
      const payload = new FormData();
      payload.append("title", courseForm.title);
      payload.append("code", courseForm.code);
      payload.append("department", courseForm.department);
      payload.append("description", courseForm.description);
      payload.append("session", currentSession._id);
      if (thumbnailFile) payload.append("thumbnail", thumbnailFile);

      await axios.post(`${apiUrl}/api/elearning/courses`, payload, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      toast.success("Course created.");
      setCourseForm({ title: "", code: "", department: "", description: "" });
      setThumbnailFile(null);
      setView("list");
      loadCourses();
    } catch (error) {
      console.error("createCourse error:", error);
      toast.error("Failed to create course.");
    } finally {
      setSavingCourse(false);
    }
  };

  const openLectures = async (course: Course) => {
    setSelectedCourse(course);
    setView("lectures");
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

  const addLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!lectureForm.title.trim()) {
      toast.error("Lecture title is required.");
      return;
    }
    if (!lectureFile && !lectureForm.externalUrl.trim()) {
      toast.error("Attach a file or paste a lecture link.");
      return;
    }

    try {
      setAddingLecture(true);
      const payload = new FormData();
      payload.append("title", lectureForm.title);
      payload.append("description", lectureForm.description);
      if (lectureForm.externalUrl.trim()) payload.append("externalUrl", lectureForm.externalUrl.trim());
      if (lectureFile) payload.append("attachment", lectureFile);

      await axios.post(`${apiUrl}/api/elearning/courses/${selectedCourse._id}/lectures`, payload, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      toast.success("Lecture added.");
      setLectureForm({ title: "", description: "", externalUrl: "" });
      setLectureFile(null);
      setShowAddLecture(false);
      openLectures(selectedCourse);
    } catch (error) {
      console.error("addLecture error:", error);
      toast.error("Failed to add lecture.");
    } finally {
      setAddingLecture(false);
    }
  };

  if (view === "addCourse") {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => setView("list")}
          className="text-slate-500 hover:text-[#004aaa] gap-2">
          <ArrowLeft size={16} /> Back to My Courses
        </Button>

        <FormShell title="Course" type="add" loading={savingCourse} onSubmit={createCourse}>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Course Title</Label>
            <Input
              value={courseForm.title}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Introduction to Programming"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Course Code</Label>
            <Input
              value={courseForm.code}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="e.g. CSC201"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Department</Label>
            <Input
              value={courseForm.department}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, department: e.target.value }))}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Course Cover Image</Label>
            <label className="flex h-[42px] cursor-pointer items-center gap-2 rounded-md border border-black px-3 text-sm text-slate-500 hover:bg-slate-50">
              <ImagePlus size={16} />
              {thumbnailFile ? thumbnailFile.name : "Choose an image (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
            </label>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Course thumbnail preview"
                className="mt-2 h-28 w-full rounded-md object-cover"
              />
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Description</Label>
            <Textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="What this course covers..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </FormShell>
      </div>
    );
  }

  if (view === "lectures" && selectedCourse) {
    return (
      <div className="p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => {
            setView("list");
            setSelectedCourse(null);
            setLectures([]);
          }}
          className="text-slate-500 hover:text-[#004aaa] gap-2">
          <ArrowLeft size={16} /> Back to My Courses
        </Button>

        {selectedCourse.thumbnailUrl ? (
          <div
            className="h-40 w-full rounded-xl bg-cover bg-center"
            style={{ backgroundImage: `url(${selectedCourse.thumbnailUrl})` }}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#004aaa] to-[#00366e]">
            <BookOpen className="text-white/70" size={40} />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-[#004aaa]">{selectedCourse.title}</h2>
            {selectedCourse.code && <p className="text-sm text-slate-500">{selectedCourse.code}</p>}
          </div>
          <Button
            onClick={() => setShowAddLecture(true)}
            className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 font-semibold">
            <Plus size={16} /> Add Lecture / Material
          </Button>
        </div>

        {showAddLecture && (
          <FormShell
            title="Lecture"
            type="add"
            loading={addingLecture}
            onSubmit={addLecture}
            onClose={() => setShowAddLecture(false)}>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Lecture Title</Label>
              <Input
                value={lectureForm.title}
                onChange={(e) => setLectureForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Week 1 — Variables and Data Types"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400">
                Lecture Link (YouTube, Zoom recording, etc.)
              </Label>
              <Input
                value={lectureForm.externalUrl}
                onChange={(e) => setLectureForm((prev) => ({ ...prev, externalUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400">
                Or upload a file (slides, PDF, recorded video)
              </Label>
              <Input
                type="file"
                onChange={(e) => setLectureFile(e.target.files?.[0] ? e.target.files[0] : null)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400">Description</Label>
              <Textarea
                value={lectureForm.description}
                onChange={(e) => setLectureForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Notes about this lecture..."
                className="min-h-[90px] resize-none"
              />
            </div>
          </FormShell>
        )}

        <Card className="border-none shadow-sm overflow-hidden ring-1 ring-slate-200">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#E8EBF3]">
                <TableRow>
                  <TableHead className="text-[#004aaa] font-bold pl-6">Title</TableHead>
                  <TableHead className="text-[#004aaa] font-bold">Type</TableHead>
                  <TableHead className="text-[#004aaa] font-bold">Description</TableHead>
                  <TableHead className="text-right text-[#004aaa] font-bold pr-6">Resource</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLectures ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-slate-500">
                      Loading lectures…
                    </TableCell>
                  </TableRow>
                ) : lectures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-slate-500">
                      No lectures added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  lectures.map((lecture) => (
                    <TableRow key={lecture._id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6 font-bold text-[#004aaa]">{lecture.title}</TableCell>
                      <TableCell className="text-slate-600 capitalize">{lecture.resourceType}</TableCell>
                      <TableCell className="text-slate-500 text-sm">{lecture.description || "—"}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button size="sm" asChild className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 h-8 px-4">
                          <a href={lecture.url} target="_blank" rel="noopener noreferrer">
                            {lecture.resourceType === "link" ? (
                              <ExternalLink size={14} />
                            ) : (
                              <FileText size={14} />
                            )}
                            Open
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-[#004aaa]">My Courses</h2>
        <Button
          onClick={() => setView("addCourse")}
          className="bg-[#004aaa] hover:bg-[#004aaa]/90 gap-2 font-semibold">
          <Plus size={16} /> Create Course
        </Button>
      </div>

      {loadingCourses ? (
        <p className="py-12 text-center text-sm text-slate-500">Loading courses…</p>
      ) : courses.length === 0 ? (
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="py-12 text-center text-sm text-slate-500">
            You haven't created any courses yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
              {course.thumbnailUrl ? (
                <div
                  className="h-32 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-[#004aaa] to-[#00366e]">
                  <BookOpen className="text-white/70" size={32} />
                </div>
              )}
              <CardContent className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#004aaa]">
                  {course.code || "Course"}
                </p>
                <h3 className="mt-1 font-bold text-black line-clamp-1">{course.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{course.department || "—"}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openLectures(course)}
                  className="mt-3 w-full">
                  Manage Lectures
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
