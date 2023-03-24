import { z, ZodType } from "zod";
import { useForm, FieldValues, UseFormReturn, SubmitHandler, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";

type ZodFormProps<Schema extends ZodType<FieldValues>> = {
  onSubmit: SubmitHandler<z.output<Schema>>;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"form">, "onSubmit" | "children">;

export type UseZodFormReturn<Schema extends ZodType<FieldValues>> = UseFormReturn<z.input<Schema>> & {
  Form: (props: ZodFormProps<Schema>) => JSX.Element;
};

export function useZodForm<TSchema extends ZodType<FieldValues>, DefaultValues = z.input<TSchema>>(
  schema: TSchema,
  options: Omit<UseFormProps<z.input<TSchema>>, "defaultValues"> & { defaultValues?: DefaultValues } = {}
): UseZodFormReturn<TSchema> {
  const { defaultValues, ...restOptions } = options;
  const methods = useForm<z.input<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    ...restOptions,
  });

  const Form = useCallback(
    ({ onSubmit, children, ...props }: ZodFormProps<TSchema>) => {
      const handleSubmit = methods.handleSubmit(onSubmit, (errors) => console.log(errors));

      return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }} {...props}>
          {children}
        </form>
      );
    },
    [methods]
  );

  return { ...methods, Form };
}
