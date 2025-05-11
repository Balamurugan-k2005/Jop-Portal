/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteInternship, saveInternship } from "@/api/apiInternships";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const InternshipCard = ({
  internship,
  savedInit = false,
  onInternshipAction = () => {},
  isMyInternship = false,
}) => {
  const [saved, setSaved] = useState(savedInit);

  const { user } = useUser();

  const { loading: loadingDeleteInternship, fn: fnDeleteInternship } = useFetch(deleteInternship, {
    internship_id: internship.id,
  });

  const {
    loading: loadingSavedInternship,
    data: savedInternship,
    fn: fnSavedInternship,
  } = useFetch(saveInternship);

  const handleSaveInternship = async () => {
    await fnSavedInternship({
      user_id: user.id,
      internship_id: internship.id,
    });
    onInternshipAction();
  };

  const handleDeleteInternship = async () => {
    await fnDeleteInternship();
    onInternshipAction();
  };

  useEffect(() => {
    if (savedInternship !== undefined) setSaved(savedInternship?.length > 0);
  }, [savedInternship]);

  return (
    <Card className="flex flex-col">
      {loadingDeleteInternship && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {internship.title}
          {isMyInternship && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteInternship}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {internship.company && <img src={internship.company.logo_url} className="h-6" />}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {internship.location}
          </div>
        </div>
        <hr />
        {internship.description.substring(0, internship.description.indexOf("."))}.
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/internship/${internship.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyInternship && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveInternship}
            disabled={loadingSavedInternship}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;
