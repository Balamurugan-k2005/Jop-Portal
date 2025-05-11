import { getSavedInternships } from "@/api/apiInternships";
import InternshipCard from "@/components/internship-card";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedInternships = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedInternships,
    data: savedInternships,
    fn: fnSavedInternships,
  } = useFetch(getSavedInternships);

  useEffect(() => {
    if (isLoaded) {
      fnSavedInternships();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedInternships) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Internships
      </h1>

      {loadingSavedInternships === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedInternships?.length ? (
            savedInternships?.map((saved) => {
              return (
                <InternshipCard
                  key={saved.id}
                  internship={saved?.internship}
                  onInternshipAction={fnSavedInternships}
                  savedInit={true}
                />
              );
            })
          ) : (
            <div>No Saved Internships </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;
