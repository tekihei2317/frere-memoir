type WorkflowDefinition<Input, Output, Steps> = {
  input: Input;
  output: Output;
  steps: Steps;
};
type AnyWorkflowDefintion = WorkflowDefinition<any, any, any>;

type Workflow<Input, Output, Steps> = (params: { input: Input; steps: Steps }) => Output;
type AnyWorkflow = Workflow<any, any, any>;

export type DefineWorkflow<Definition extends AnyWorkflowDefintion> = Definition extends WorkflowDefinition<
  infer Input,
  infer Output,
  infer Steps
>
  ? Workflow<Input, Output, Steps>
  : never;

export type WorkflowSteps<TWorkflow extends AnyWorkflow> = TWorkflow extends Workflow<any, any, infer Steps>
  ? Steps
  : never;
