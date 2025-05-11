import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job"; // Rename if needed for internships
import ApplicationCard from "@/components/application-card";

import useFetch from "@/hooks/use-fetch";
import { getSingleInternship, updateInternshipStatus } from "@/api/apiInternships"; // ✅ Single Import

const InternshipPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  const {
    loading: loadingInternship,
    data: internship,
    fn: fetchInternship,
  } = useFetch(getSingleInternship, { internship_id: id });

  useEffect(() => {
    if (isLoaded) fetchInternship();
  }, [isLoaded]);

  const { loading: loadingStatus, fn: updateStatus } = useFetch(updateInternshipStatus, {
    internship_id: id,
  });

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    updateStatus(isOpen).then(() => fetchInternship());
  };

  if (!isLoaded || loadingInternship) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {internship?.title}
        </h1>
        <img src={internship?.company?.logo_url} className="h-12" alt={internship?.title} />
      </div>

      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {internship?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {internship?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {internship?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {internship?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${internship?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue placeholder={`Hiring Status (${internship?.isOpen ? "Open" : "Closed"})`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the Internship</h2>
      <p className="sm:text-lg">{internship?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown source={internship?.requirements} className="bg-transparent sm:text-lg" />

      {internship?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={internship} // Consider renaming ApplyJobDrawer to a more generic name
          user={user}
          fetchJob={fetchInternship} // Function name updated to fetchInternship
          applied={internship?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {loadingStatus && <BarLoader width={"100%"} color="#36d7b7" />}

      {internship?.applications?.length > 0 && internship?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold mb-4 text-xl ml-1">Applications</h2>
          {internship?.applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipPage;
