import { Card } from "@/components/ui/card";
import BlankModal from "@/modals/blankModal/blankModal";
import IFrame from "./IFrame";


const CRMTab = ({ open, setOpen, size }) => {

  const ButtonLabel = () => (
    <span className="hidden md:block">{"CRM"}</span>
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
          tag={<IFrame url={"http://localhost:8000/crm/leads/view"} height={undefined} borderRadius={"20px"}/>}
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

export default CRMTab;
