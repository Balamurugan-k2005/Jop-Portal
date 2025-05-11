import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import { useEffect } from "react";
import { getInternshipApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const CreatedInternshipApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingInternshipApplications,
    data: internshipApplications,
    fn: fnInternshipApplications,
  } = useFetch(getInternshipApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnInternshipApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingInternshipApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {internshipApplications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedInternshipApplications;
