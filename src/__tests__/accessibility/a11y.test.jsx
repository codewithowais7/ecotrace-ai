import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';

import { AppProvider } from '../../context/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SkipLink from '../../components/layout/SkipLink';
import ActivityForm from '../../components/forms/ActivityForm';

// ─── Wrapper providing all required context and router ────────────────────────

function Wrapper({ children }) {
  return (
    <AppProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProvider>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

describe('Accessibility — Button', () => {
  it('default button has no violations', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('loading button has no violations', async () => {
    const { container } = render(
      <Button loading ariaLabel="Saving changes">
        Save
      </Button>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disabled button has no violations', async () => {
    const { container } = render(<Button disabled>Cannot click</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('danger variant has no violations', async () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── Input ────────────────────────────────────────────────────────────────────

describe('Accessibility — Input', () => {
  it('basic input with label has no violations', async () => {
    const { container } = render(
      <Input id="name" name="name" label="Your name" value="" onChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('input with error has no violations', async () => {
    const { container } = render(
      <Input
        id="qty"
        name="qty"
        label="Quantity"
        value=""
        onChange={() => {}}
        error="Required"
        required
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('input with hint has no violations', async () => {
    const { container } = render(
      <Input
        id="email"
        name="email"
        label="Email address"
        value=""
        onChange={() => {}}
        hint="We'll never share your email"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── Select ───────────────────────────────────────────────────────────────────

describe('Accessibility — Select', () => {
  const OPTIONS = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('basic select has no violations', async () => {
    const { container } = render(
      <Select
        id="cat"
        name="cat"
        label="Category"
        value="a"
        onChange={() => {}}
        options={OPTIONS}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('select with error has no violations', async () => {
    const { container } = render(
      <Select
        id="cat"
        name="cat"
        label="Category"
        value=""
        onChange={() => {}}
        options={OPTIONS}
        error="Please select a category"
        required
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── Card ─────────────────────────────────────────────────────────────────────

describe('Accessibility — Card', () => {
  it('div card has no violations', async () => {
    const { container } = render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('section card with ariaLabel has no violations', async () => {
    const { container } = render(
      <Card as="section" ariaLabel="Emission summary">
        <p>Content</p>
      </Card>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── Badge ────────────────────────────────────────────────────────────────────

describe('Accessibility — Badge', () => {
  it('low badge has no violations', async () => {
    const { container } = render(<Badge level="low" value="2.1 kg CO₂e" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('very-high badge has no violations', async () => {
    const { container } = render(<Badge level="very-high" value="35 kg CO₂e" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── LoadingSpinner ───────────────────────────────────────────────────────────

describe('Accessibility — LoadingSpinner', () => {
  it('default spinner has no violations', async () => {
    const { container } = render(<LoadingSpinner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('small spinner has no violations', async () => {
    const { container } = render(<LoadingSpinner size="sm" message="Fetching data" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── Layout ───────────────────────────────────────────────────────────────────

describe('Accessibility — Layout components', () => {
  it('SkipLink has no violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <SkipLink />
      </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Header has no violations', async () => {
    const { container } = render(
      <Wrapper>
        <Header />
      </Wrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Footer has no violations', async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ─── ActivityForm ─────────────────────────────────────────────────────────────

describe('Accessibility — ActivityForm', () => {
  it('empty form has no violations', async () => {
    const { container } = render(
      <Wrapper>
        <ActivityForm />
      </Wrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
