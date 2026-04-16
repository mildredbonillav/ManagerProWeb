import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardSmall({ data, error }) {
  return (
    <Card size="sm" className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Api test</CardTitle>
        <CardDescription>
          This tests an api call on C# using shadcn/ui
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data ? (
          <p>
            Application: {data.application}
            <br />
            Message: {data.message}
            <br />
            Timestamp (UTC): {data.timestampUtc}
            <br />
            Example Config: {data.exampleConfig || "Not set"}
          </p>
        ) : error ? (
          <p>Failed to load data: {error}</p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  );
}

const InfoComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const useApi = async () => {
      try {
        const res = await fetch("http://localhost:5019/api/info");
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
        setError(error);
      }
    };
    useApi();
  }, []);

  return (
    <div>
      <CardSmall data={data} error={error} />
    </div>
  );
};

export default InfoComponent;
