import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface GenericFormProps<T extends z.ZodType<any, any>> {
  schema: T;
  onSubmit: SubmitHandler<z.infer<T>>;
  children: React.ReactNode | React.ReactNode[];
  className: string;
}

export function Form<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  children,
  className,
}: GenericFormProps<T>) {
  type FormData = z.infer<T>;

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
