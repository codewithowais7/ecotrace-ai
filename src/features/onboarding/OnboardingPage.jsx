/**
 * Onboarding flow — 3-step wizard that collects user profile information.
 * Redirects to /dashboard on completion.
 */

import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import AppContext from '../../context/AppContext';
import { APP_CONSTANTS } from '../../constants/categories';
import { validateNumericInput, validateTextField } from '../../utils/validators';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// ─── Static option lists ─────────────────────────────────────────────────────

const LOCATION_OPTIONS = [
  { value: 'india', label: '🇮🇳 India' },
  { value: 'usa', label: '🇺🇸 United States' },
  { value: 'uk', label: '🇬🇧 United Kingdom' },
  { value: 'europe', label: '🇪🇺 Europe' },
  { value: 'other', label: '🌍 Other' },
];

const TRANSPORT_OPTIONS = [
  { value: 'car_petrol', label: 'Car (Petrol)' },
  { value: 'car_electric', label: 'Car (Electric)' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'walking', label: 'Walking' },
];

const STEP_LABELS = ['Welcome', 'Location & Transport', 'Set Your Goal'];

// ─── Step sub-components ─────────────────────────────────────────────────────

function StepOne({ name, onChange, error }) {
  return (
    <section aria-label="Step 1: Welcome">
      <p className="text-slate-400 text-sm mb-6">
        Understanding your footprint starts with knowing who you are.
      </p>
      <Input
        id="name"
        name="name"
        label="Your Name"
        value={name}
        onChange={onChange}
        error={error}
        placeholder="e.g. Priya"
        required
      />
    </section>
  );
}

StepOne.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

function StepTwo({ location, transport, onLocationChange, onTransportChange }) {
  return (
    <section aria-label="Step 2: Location and transport">
      <p className="text-slate-400 text-sm mb-6">
        This helps us use the right emission factors for your region.
      </p>
      <div className="flex flex-col gap-4">
        <Select
          id="location"
          name="location"
          label="Your Location"
          value={location}
          onChange={onLocationChange}
          options={LOCATION_OPTIONS}
          required
        />
        <Select
          id="primaryTransport"
          name="primaryTransport"
          label="Primary Mode of Transport"
          value={transport}
          onChange={onTransportChange}
          options={TRANSPORT_OPTIONS}
          required
        />
      </div>
    </section>
  );
}

StepTwo.propTypes = {
  location: PropTypes.string.isRequired,
  transport: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onTransportChange: PropTypes.func.isRequired,
};

function StepThree({ goal, onChange, error }) {
  return (
    <section aria-label="Step 3: Set your daily goal">
      <p className="text-slate-400 text-sm mb-2">Start with the average and reduce over time.</p>
      <p className="text-xs text-slate-500 mb-6">
        🇮🇳 Indian average: {APP_CONSTANTS.INDIA_AVERAGE_DAILY_KG} kg/day &nbsp;·&nbsp; 🌍 Global
        average: {APP_CONSTANTS.GLOBAL_AVERAGE_DAILY_KG} kg/day
      </p>
      <Input
        id="dailyGoal"
        name="dailyGoal"
        label="Daily Carbon Goal (kg CO₂e)"
        type="number"
        value={goal}
        onChange={onChange}
        error={error}
        hint={`Default is the Indian average (${APP_CONSTANTS.INDIA_AVERAGE_DAILY_KG} kg)`}
        required
      />
    </section>
  );
}

StepThree.propTypes = {
  goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { updateUserProfile, setOnboardingComplete, onboardingComplete } = useContext(AppContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('india');
  const [transport, setTransport] = useState('bus');
  const [goal, setGoal] = useState(APP_CONSTANTS.DEFAULT_DAILY_GOAL_KG);
  const [errors, setErrors] = useState({});

  // Redirect if already onboarded
  useEffect(() => {
    if (onboardingComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [onboardingComplete, navigate]);

  if (onboardingComplete) {
    return null;
  }

  function validate() {
    const newErrors = {};

    if (step === 1) {
      const r = validateTextField(name, 100);
      if (!r.valid) newErrors.name = r.error;
    }

    if (step === 3) {
      const r = validateNumericInput(goal, 0.1, 200);
      if (!r.valid) newErrors.goal = r.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) return;

    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      // Complete onboarding
      updateUserProfile({
        name,
        location,
        primaryTransport: transport,
        dailyGoal: parseFloat(goal),
      });
      setOnboardingComplete(true);
      navigate('/dashboard', { replace: true });
    }
  }

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <main
      id="main-content"
      className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12"
    >
      <div className="w-full max-w-md">
        {/* ── Page heading ── */}
        <div className="text-center mb-8">
          <span aria-hidden="true" className="text-5xl">
            🌱
          </span>
          <h1 className="text-2xl font-bold text-white mt-3">Welcome to EcoTrace AI</h1>
          <p className="text-slate-400 text-sm mt-1">Set up your profile in 3 quick steps</p>
        </div>

        {/* ── Progress indicator ── */}
        <div className="mb-8">
          {/* ARIA progressbar */}
          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Onboarding step ${step} of 3`}
            className="h-1.5 bg-[#0f3460] rounded-full overflow-hidden mb-4"
          >
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-3" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  n < step
                    ? 'bg-green-600 text-white'
                    : n === step
                      ? 'ring-2 ring-green-500 bg-transparent text-green-400'
                      : 'bg-[#0f3460] text-slate-500',
                ].join(' ')}
              >
                {n < step ? '✓' : n}
              </div>
            ))}
          </div>

          {/* Visible step text */}
          <p className="text-center text-xs text-slate-400 mt-2">
            Step {step} of 3 — {STEP_LABELS[step - 1]}
          </p>
        </div>

        {/* ── Step content ── */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{STEP_LABELS[step - 1]}</h2>

          {step === 1 && (
            <StepOne
              name={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({});
              }}
              error={errors.name}
            />
          )}
          {step === 2 && (
            <StepTwo
              location={location}
              transport={transport}
              onLocationChange={(e) => setLocation(e.target.value)}
              onTransportChange={(e) => setTransport(e.target.value)}
            />
          )}
          {step === 3 && (
            <StepThree
              goal={goal}
              onChange={(e) => {
                setGoal(e.target.value);
                setErrors({});
              }}
              error={errors.goal}
            />
          )}
        </Card>

        {/* ── Navigation ── */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="secondary"
              onClick={() => {
                setStep((s) => s - 1);
                setErrors({});
              }}
              className="flex-1"
            >
              ← Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1">
            {step === 3 ? '🌍 Start Tracking' : 'Next →'}
          </Button>
        </div>
      </div>
    </main>
  );
}
