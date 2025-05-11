import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { createInternship } from "@/api/apiInternships";
import { getCompanies } from "@/api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import AddCompanyDrawer from "@/components/add-company-drawer";

// Validation Schema using Zod
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostInternship = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateInternship,
    error: errorCreateInternship,
    data: dataCreateInternship,
    fn: fnCreateInternship,
  } = useFetch(createInternship);

  const onSubmit = (data) => {
    fnCreateInternship({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateInternship?.length > 0) navigate("/internships");
  }, [loadingCreateInternship]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/internships" />;
  }

  return (
    <div>
      <h1 className="font-extrabold text-5xl sm:text-7xl text-center pb-8 text-black">
        Post an Internship
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        <Input
          className="bg-white text-black border border-gray-300"
          placeholder="Internship Title"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea
          className="bg-white text-black border border-gray-300"
          placeholder="Internship Description"
          {...register("description")}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white text-black border border-gray-300 rounded-md">
                  <SelectValue placeholder="Internship Location" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-gray-300">
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white text-black border border-gray-300 rounded-md">
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-gray-300">
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        {errors.company_id && <p className="text-red-500">{errors.company_id.message}</p>}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && <p className="text-red-500">{errors.requirements.message}</p>}
        {errorCreateInternship?.message && (
          <p className="text-red-500">{errorCreateInternship?.message}</p>
        )}
        {loadingCreateInternship && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostInternship;
