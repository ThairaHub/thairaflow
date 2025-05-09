import ForwardedIconComponent from "@/components/common/genericIconComponent";
import BlankModal from "@/modals/blankModal/blankModal";
import IFrame from "./IFrame";
import { Card } from "@/components/ui/card";


const LandingPageTab = ({ open, setOpen, size }) => {

const ButtonLabel = () => (
  <span className="hidden md:block">{"Landing Page"}</span>
);

const handleClick = async () => {
  console.log("crm")
};


return (
  <div>
    <div className="flex h-full w-full gap-1.5 rounded-sm transition-all">
    <BlankModal          
        open={open} 
        setOpen={setOpen}
        tag={<IFrame url={"http://localhost:53435"} height={"88vh"} borderRadius={undefined}/>}
        size={size || "large"}
        >
        <Card
        key={1}
        draggable
        onDragStart={false}
        onClick={handleClick}
        className={`my-1 flex flex-col rounded-lg border border-border bg-background p-4 hover:border-placeholder-foreground hover:shadow-sm cursor-pointer`}
        > 
          <ButtonLabel />
        </Card>

    </BlankModal>
    </div>

  </div>

  )
};

export default LandingPageTab;
