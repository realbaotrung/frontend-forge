import { Button } from "antd";
import { useDispatch } from "react-redux";
import { showAllDbIdErrorDoors } from "../../../../../slices/forgeStandard/checkDoors";

export default function TotalErrorDoors() {

  const dispatch = useDispatch();
  const handleOnclick = () => {
    dispatch(showAllDbIdErrorDoors(true))
  }

  return (
    <Button onClick={handleOnclick}>Show all errors</Button>
  );
}
