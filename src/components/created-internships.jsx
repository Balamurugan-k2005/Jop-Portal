import { getMyInternships } from "@/api/apiInternships";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import InternshipCard from "./internship-card";
import { useEffect } from "react";

const CreatedInternships = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedInternships,
    data: createdInternships,
    fn: fnCreatedInternships,
  } = useFetch(getMyInternships, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loadingCreatedInternships ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdInternships?.length ? (
            createdInternships.map((internship) => {
              return (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onInternshipAction={fnCreatedInternships}
                  isMyInternship
                />
              );
            })
          ) : (
            <div>No Internships Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedInternships;
