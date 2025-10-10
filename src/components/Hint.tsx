// React in scope not required with react-jsx runtime

type Props = {
  show: boolean;
  text: string;
};

export function Hint({ show, text }: Props) {
  return (
    <div className="-mt-4 mb-2 h-[3rem] leading-none text-neutral-300 [font-family:Tahoma]">
      <span className={(show ? 'visible' : 'invisible') + ' text-[2rem]'}>
        {text}
      </span>
    </div>
  );
}
