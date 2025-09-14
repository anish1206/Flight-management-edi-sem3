import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useData } from "../context/DataContext";
import { useState } from "react";
import type { DefectLog, Severity } from "@shared/api";

const CATEGORIES: DefectLog["category"][] = [
  "Seat",
  "Lights",
  "Air Conditioning",
  "Lavatory",
  "In-flight Entertainment",
];

export default function Cabin() {
  const { addDefect } = useData();
  const [category, setCategory] = useState<DefectLog["category"]>(CATEGORIES[0]);
  const [severity, setSeverity] = useState<Severity>("Low");
  const [description, setDescription] = useState("");
  const [flight, setFlight] = useState("");

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-white/10 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-white/80 text-lg">Cabin Defect Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-2">
              <Label className="text-white/70">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as DefectLog["category"])}>
                <SelectTrigger className="bg-white/10 border-white/10 text-white/90">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0b1c39] text-white/90 border-white/10">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="focus:bg-white/10">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-white/70">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue observed during flight..."
                className="bg-white/10 border-white/10 placeholder:text-white/50 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-white/70">Severity</Label>
              <RadioGroup
                className="flex gap-6"
                value={severity}
                onValueChange={(v) => setSeverity(v as Severity)}
              >
                {(["Low", "Medium", "High"] as const).map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <RadioGroupItem value={s} id={`sev-${s}`} />
                    <Label htmlFor={`sev-${s}`}>{s}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label className="text-white/70">Flight (optional)</Label>
              <input
                value={flight}
                onChange={(e) => setFlight(e.target.value)}
                placeholder="e.g., 235"
                className="w-full rounded-md bg-white/10 px-3 py-2 text-sm placeholder-white/50 outline-none focus:ring-2 focus:ring-sky-500/60 border border-white/10"
              />
            </div>

            <div className="pt-2">
              <Button
                onClick={() => {
                  if (!description.trim()) return;
                  addDefect({ category, description, severity, flight: flight ? `Flight ${flight}` : undefined });
                  setDescription("");
                  setFlight("");
                }}
              >
                Submit Defect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
