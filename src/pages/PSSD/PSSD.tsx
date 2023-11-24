import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Divider, Heading, IconButton, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import React, { ChangeEventHandler } from "react";
import { UserPSSDInfo } from "../../backend/src/database/user/user";
import { useDebounce } from "use-debounce";
import EditableList from "../../components/EditableList";

const presetSymptoms = [
  "Erectile dysfunction",
  "Loss of vaginal lubrication",
  "Genital numbness",
  "Anorgasmia",
  "Reduced sexual desire/libido",
  "Loss of sexual desire/libido",
  "Reduced ability to become sexually aroused",
  "Genital pain",
  "Anhedonia",
  "Emotional blunting/numbing",
  'Difficulty thinking or concentrating\n("brain fog")',
  "Issues with memory and recall",
  "Inability to feel certain emotions\n(love, fear, ...)",
  "Depersonalization",
  "Derealization",
];

const ssriMedications = [
  "Fluoxetine (Prozac)",
  "Sertraline (Zoloft)",
  "Paroxetine (Paxil)",
  "Citalopram (Celexa)",
  "Escitalopram (Lexapro)",
  "Fluvoxamine (Luvox)",
  "Vilazodone (Viibryd)",
  "Vortioxetine (Trintellix)",
  "Dapoxetine (Priligy)",
  "Sibutramine (Meridia)",
  "Levomilnacipran (Fetzima)",
  "Milnacipran (Savella)",
  "Femoxetine (Malexil)",
  "Indalpine (Upstene)",
  "Zimelidine (Zelmid)",
];

const snriMedications = [
  "Venlafaxine (Effexor)",
  "Duloxetine (Cymbalta)",
  "Desvenlafaxine (Pristiq)",
  "Levomilnacipran (Fetzima)",
  "Milnacipran (Savella)",
];

const antipsychoticMedications = [
  "Aripiprazole (Abilify)",
  "Risperidone (Risperdal)",
  "Olanzapine (Zyprexa)",
  "Quetiapine (Seroquel)",
  "Ziprasidone (Geodon)",
  "Clozapine (Clozaril)",
  "Lurasidone (Latuda)",
  "Paliperidone (Invega)",
  "Asenapine (Saphris)",
  "Iloperidone (Fanapt)",
];

const medications = [...ssriMedications, ...snriMedications, ...antipsychoticMedications];
medications.sort();

const PSSD = () => {
  const { user: userStore } = useStore();
  const navigate = useNavigate();
  const userData = userStore.user;

  const [profile, setProfile] = React.useState<Partial<UserPSSDInfo>>(
    userData?.pssd ?? {}
  );

  const [debouncedProfile] = useDebounce(profile, 300);

  React.useEffect(() => {
    userStore.updateUser({ pssd: { ...debouncedProfile } });
  }, [debouncedProfile]);

  const updateProfile =
    (type: keyof UserPSSDInfo): ChangeEventHandler<any> =>
    (event) => {
      setProfile((p) => ({ ...p, [type]: event.target.value }));
    };

  const updateSymptoms = (symptoms: string[]) => {
    setProfile((p) => ({ ...p, symptoms }));
  };

  const updateMedications = (medications: string[]) => {
    setProfile((p) => ({ ...p, medications }));
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" padding="12px">
        <IconButton
          background="none"
          aria-label="back"
          cursor="pointer"
          boxSize="36px"
          onClick={() => navigate("/profile")}
          as={ArrowBackIcon}
        />
        <Heading marginLeft="24px" size="md">
          Edit PSSD Info
        </Heading>
      </Box>
      <Divider />
      <Box paddingX="16px">
        <Heading size="sm" marginY={4}>
          I've had PSSD for
        </Heading>
        <Select value={profile.duration} onChange={updateProfile("duration")} marginY={4}>
          <option value="3to6months">3 – 6 months</option>
          <option value="6to12months">6 – 12 months</option>
          <option value="1to2years">1 – 2 years</option>
          <option value="3to5years">3 – 5 years</option>
          <option value="5to10years">5 – 10 years</option>
          <option value="morethan10years">10+ years</option>
        </Select>
        <Heading size="sm" marginY={4}>
          I have the following symptoms
        </Heading>
        <EditableList
          items={profile.symptoms}
          presetItems={presetSymptoms}
          onChange={updateSymptoms}
        />
        <Heading size="sm" marginY={4}>
          I took the following medications
        </Heading>
        <EditableList
          items={profile.medications}
          presetItems={medications}
          onChange={updateMedications}
        />
      </Box>
    </Box>
  );
};

export default PSSD;
