import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EngineTable from "@/components/dashboard/EngineTable";
import RulChart from "@/components/dashboard/RulChart";
import Contributors from "@/components/dashboard/Contributors";
import { useData } from "../context/DataContext";
import { useState } from "react";

export default function FleetOverview() {
  const { engines } = useData();
  const [selected, setSelected] = useState(engines[0]);

  return (
    <Layout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/10 text-white xl:col-span-2">
          <CardHeader className="p-4">
            <CardTitle className="text-sm text-white/70">Engine List</CardTitle>
          </CardHeader>
          <CardContent>
            <EngineTable engines={engines} onSelect={setSelected} />
          </CardContent>
        </Card>

        {selected && (
          <div className="space-y-4">
            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-white/70">RUL Prediction — Engine #{selected.id}</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <RulChart engine={selected} height={240} />
                <div className="mt-3 text-xs text-white/70">
                  Predicted failure: {selected.predictedFailureComponent} • CI: {Math.round(selected.confidenceLow)}–{Math.round(selected.confidenceHigh)} cycles
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/10 text-white">
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-white/70">Explainability</CardTitle>
              </CardHeader>
              <CardContent>
                <Contributors items={selected.contributors} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
