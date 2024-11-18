import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  Divider,
  HoverCard,
  Input,
  Modal,
  Paper,
  Popover,
  Select,
  Switch,
  Table,
  Tooltip,
  createTheme,
  defaultVariantColorsResolver,
  rem,
} from '@mantine/core';
import { CSSVariablesResolver, alpha } from '@mantine/core';
import { Spotlight } from '@mantine/spotlight';

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem('200px'),
  xs: rem('300px'),
  sm: rem('400px'),
  md: rem('500px'),
  lg: rem('600px'),
  xl: rem('1400px'),
  xxl: rem('1600px'),
};

const zincColors = [
  '#fafafa',
  '#f4f4f5',
  '#e4e4e7',
  '#d4d4d8',
  '#a1a1aa',
  '#52525b',
  '#3f3f46',
  '#27272a',
  '#18181b',
  '#09090b',
  '#71717A',
] as const;
const slateColors = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
  '#020817',
  '#64748B',
] as const;
const stoneColors = [
  '#fafaf9',
  '#f5f5f4',
  '#e7e5e4',
  '#d6d3d1',
  '#a8a29e',
  '#57534e',
  '#44403c',
  '#292524',
  '#1c1917',
  '#0c0a09',
  '#78716C',
] as const;
const grayColors = [
  '#f9fafb',
  '#f3f4f6',
  '#e5e7eb',
  '#d1d5db',
  '#9ca3af',
  '#4b5563',
  '#374151',
  '#1f2937',
  '#111827',
  '#030712',
  '#6B7280',
] as const;
const neutralColors = [
  '#fafafa',
  '#f5f5f5',
  '#e5e5e5',
  '#d4d4d4',
  '#a3a3a3',
  '#525252',
  '#404040',
  '#262626',
  '#171717',
  '#0a0a0a',
  '#737373',
] as const;
const redColors = [
  '#FEF2F2',
  '#FEE2E2',
  '#FECACA',
  '#FCA5A5',
  '#F87171',
  '#DC2626',
  '#B91C1C',
  '#991B1B',
  '#7F1D1D',
  '#450A0A',
  '#EF4444',
] as const;
const roseColors = [
  '#fff1f2',
  '#ffe4e6',
  '#fecdd3',
  '#fda4af',
  '#fb7185',
  '#e11d48',
  '#be123c',
  '#9f1239',
  '#881337',
  '#4c0519',
  '#F43F5E',
] as const;
const orangeColors = [
  '#fff7ed',
  '#ffedd5',
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#f97316',
  '#ea580c',
  '#9a3412',
  '#7c2d12',
  '#431407',
  '#F97316',
] as const;
const greenColors = [
  '#F0FDF4',
  '#DCFCE7',
  '#BBF7D0',
  '#86EFAC',
  '#4ADE80',
  '#22c55e',
  '#16A34A',
  '#166534',
  '#14532D',
  '#052E16',
  '#10B981',
] as const;
const blueColors = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6',
  '#2563eb',
  '#1e40af',
  '#1e3a8a',
  '#172554',
  '#3B82F6',
] as const;
const yellowColors = [
  '#fefce8',
  '#fef9c3',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#ca8a04',
  '#a16207',
  '#854d0e',
  '#713f12',
  '#3f2c06',
  '#F59E0B',
] as const;
const violetColors = [
  '#f5f3ff',
  '#ede9fe',
  '#ddd6fe',
  '#c4b5fd',
  '#a78bfa',
  '#7c3aed',
  '#6d28d9',
  '#5b21b6',
  '#4c1d95',
  '#1e1b4b',
  '#8B5CF6',
] as const;
const amberColors = [
  '#FFFBEB',
  '#FEF3C7',
  '#FDE68A',
  '#FCD34D',
  '#FBBF24',
  '#D97706',
  '#B45309',
  '#92400E',
  '#78350F',
  '#451A03',
  '#F59E0B',
] as const;

export const shadcnCssVariableResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    // variables that do not depend on color scheme
    '--mantine-heading-font-weight': '600',
    '--mantine-primary-color-filled-hover': alpha(
      'var(--mantine-primary-color-filled)',
      0.9,
    ),
    '--mantine-primary-color-light': 'var(--mantine-color-secondary-light)',
    '--mantine-primary-color-light-hover': alpha(
      'var(--mantine-primary-color-light)',
      0.8,
    ),
    '--mantine-primary-color-light-color':
      'var(--mantine-color-secondary-light-color)',
  },
  light: {
    // all variables that depend on lighth color scheme
    '--mantine-primary-color-contrast': 'var(--mantine-primary-color-0)', // used as primary color contrast
    '--mantine-color-bright': 'var(--mantine-color-secondary-0)', // used as theme's bright color
    '--mantine-color-text': 'var(--mantine-color-secondary-9)', // used as text color
    '--mantine-color-body': 'var(--mantine-color-white)', // used as body color
    '--mantine-color-error': 'var(--mantine-color-error-10)', // used as error color
    '--mantine-color-placeholder': 'var(--mantine-color-secondary-10)', // used as placeholder color
    '--mantine-color-anchor': 'var(--mantine-color-secondary-10)', // used as anchor color

    '--mantine-color-default': 'var(--mantine-color-bright)', // used as default surface color
    '--mantine-color-default-hover': 'var(--mantine-color-secondary-1)', // used as default hover color
    '--mantine-color-default-color': 'var(--mantine-color-secondary-9)', // used as default text color
    '--mantine-color-default-border': 'var(--mantine-color-secondary-2)', // used as default border color
    '--mantine-color-dimmed': 'var(--mantine-color-secondary-10)', // used as dimmed text color

    '--mantine-color-secondary-filled': 'var(--mantine-color-bright)', // used as secondary surface color
    '--mantine-color-secondary-filled-hover':
      'var(--mantine-color-secondary-1)', // used as secondary hover color

    '--mantine-color-secondary-light': 'var(--mantine-color-secondary-1)', // used as primary light color
    '--mantine-color-secondary-light-hover': alpha(
      'var(--mantine-color-secondary-light)',
      0.8,
    ), // used as primary light hover color

    '--mantine-color-secondary-text': 'var(--mantine-primary-color-contrast)', // can be used as secondary text color
    '--mantine-color-secondary-light-color': 'var(--mantine-color-secondary-8)', // used as primary light variant's text color

    '--mantine-color-secondary-outline': 'var(--mantine-color-secondary-2)',
    '--mantine-color-secondary-outline-hover':
      'var(--mantine-color-secondary-1)',
  },
  dark: {
    // all variables that depend on dark color scheme
    '--mantine-primary-color-contrast': 'var(--mantine-color-secondary-8)', // used as primary color contrast
    '--mantine-color-bright': 'var(--mantine-color-secondary-9)', // used as theme's bright color
    '--mantine-color-text': 'var(--mantine-color-secondary-0)', // used as text color
    '--mantine-color-body': 'var(--mantine-color-bright)', // used as body color
    '--mantine-color-error': 'var(--mantine-color-error-10)', // used as error color
    '--mantine-color-placeholder': 'var(--mantine-color-secondary-4)', // used as placeholder color
    '--mantine-color-anchor': 'var(--mantine-color-secondary-4)', // used as anchor color

    '--mantine-color-default': 'var(--mantine-color-secondary-9)', // used as default surface color
    '--mantine-color-default-hover': 'var(--mantine-color-secondary-7)', // used as default hover color
    '--mantine-color-default-color': 'var(--mantine-color-secondary-1)', // used as default text color
    '--mantine-color-default-border': 'var(--mantine-color-secondary-7)', // used as default border color
    '--mantine-color-dimmed': 'var(--mantine-color-secondary-4)', // used as dimmed text color

    '--mantine-color-secondary-filled': 'var(--mantine-color-secondary-8)', // used as secondary surface color
    '--mantine-color-secondary-filled-hover': alpha(
      'var(--mantine-color-secondary-filled)',
      0.9,
    ), //used as secondary hover color

    '--mantine-color-secondary-light': 'var(--mantine-color-secondary-7)', // used as primary light color
    '--mantine-color-secondary-light-hover': alpha(
      'var(--mantine-color-secondary-light)',
      0.8,
    ), // used as primary light hover color

    '--mantine-color-secondary-text': 'var(--mantine-primary-color-contrast)', // can be used as secondary text color
    '--mantine-color-secondary-light-color': 'var(--mantine-color-secondary-0)', // used as primary light text color

    '--mantine-color-secondary-outline': 'var(--mantine-color-secondary-7)',
    '--mantine-color-secondary-outline-hover':
      'var(--mantine-color-secondary-7)',
  },
});

export const shadcnTheme = createTheme({
  colors: {
    zinc: zincColors,
    slate: slateColors,
    stone: stoneColors,
    gray: grayColors,
    neutral: neutralColors,
    red: redColors,
    rose: roseColors,
    orange: orangeColors,
    green: greenColors,
    blue: blueColors,
    yellow: yellowColors,
    violet: violetColors,

    primary: zincColors,
    secondary: zincColors, // secondary will be dynamically changed baesd on the primary color
    dark: zincColors, // dark will always be secondary color

    error: redColors,
    warning: amberColors,
    success: greenColors,
  },
  focusRing: 'never',
  scale: 1,
  primaryColor: 'primary',
  primaryShade: { light: 8, dark: 0 },
  autoContrast: true,
  luminanceThreshold: 0.3,
  radius: {
    xs: rem('6px'),
    sm: rem('8px'),
    md: rem('12px'),
    lg: rem('16px'),
    xl: rem('24px'),
  },
  defaultRadius: 'sm',
  spacing: {
    '3xs': rem('4px'),
    '2xs': rem('8px'),
    xs: rem('10px'),
    sm: rem('12px'),
    md: rem('16px'),
    lg: rem('20px'),
    xl: rem('24px'),
    '2xl': rem('28px'),
    '3xl': rem('32px'),
  },
  fontSizes: {
    xs: rem('12px'),
    sm: rem('14px'),
    md: rem('16px'),
    lg: rem('18px'),
    xl: rem('20px'),
    '2xl': rem('24px'),
    '3xl': rem('30px'),
    '4xl': rem('36px'),
    '5xl': rem('48px'),
  },
  lineHeights: {
    xs: rem('18px'),
    sm: rem('20px'),
    md: rem('24px'),
    lg: rem('28px'),
  },

  headings: {
    fontFamily: 'Geist',
    sizes: {
      h1: {
        fontSize: rem('36px'),
        lineHeight: rem('44px'),
        fontWeight: '600',
      },
      h2: {
        fontSize: rem('30px'),
        lineHeight: rem('38px'),
        fontWeight: '600',
      },
      h3: {
        fontSize: rem('24px'),
        lineHeight: rem('32px'),
        fontWeight: '600',
      },
      h4: {
        fontSize: rem('20px'),
        lineHeight: rem('30px'),
        fontWeight: '600',
      },
    },
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px rgba(0, 0, 0, 0.25)',
  },

  cursorType: 'pointer',
  other: {
    style: 'shadcn',
  },
  variantColorResolver: (component) => {
    const defaultResolvedColors = defaultVariantColorsResolver(component);

    if (component.variant === 'default') {
      return {
        ...defaultResolvedColors,
        background: 'var(--mantine-color-default)',
        border: '1px solid var(--mantine-color-default-border)',
        hover: 'var(--mantine-color-default-hover)',
      };
    }

    if (component.variant === 'filled') {
      return {
        ...defaultResolvedColors,
        background: 'var(--mantine-primary-color-filled)',
        hover: 'var(--mantine-primary-color-filled-hover)',
        color: 'var(--mantine-primary-color-contrast)',
      };
    }

    if (component.variant === 'light') {
      return {
        ...defaultResolvedColors,
        background: 'var(--mantine-primary-color-light)',
        hover: 'var(--mantine-primary-color-light-hover)',
        color: 'var(--mantine-primary-color-light-color)',
      };
    }

    if (component.variant === 'outline') {
      return {
        ...defaultResolvedColors,
        background: 'var(--mantine-color-default)',
        border: '1px solid var(--mantine-color-default-border)',
        hover: 'var(--mantine-color-default-hover)',
        color: 'var(--mantine-color-default-color)',
      };
    }

    if (component.variant === 'subtle') {
      return {
        ...defaultResolvedColors,
        background: 'transparent',
        hover: 'var(--mantine-color-default-hover)',
        color: 'var(--mantine-color-default-color)',
      };
    }

    return defaultResolvedColors;
  },
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
    Card: Card.extend({
      defaultProps: {
        p: 'xl',
        shadow: 'xl',
        radius: 'md',
        withBorder: true,
      },
      classNames: (theme) => ({
        root: 'globalMantineCardRoot',
      }),
    }),
    Paper: Paper.extend({
      defaultProps: {
        // p: "md",
        shadow: 'xl',
        radius: 'md',
        withBorder: true,
      },
    }),
    Popover: Popover.extend({
      styles: () => ({
        dropdown: {
          backgroundColor: 'var(--mantine-color-default)',
          borderColor: 'var(--mantine-color-default-border)',
        },
      }),
    }),
    Input: Input.extend({
      classNames: (_theme, props) => {
        if (props.variant !== 'unstyled')
          return {
            input: 'globalMantineInput',
          };

        return {};
      },
      vars: (theme) => {
        return {
          input: {
            '--input-bd': 'var(--mantine-color-default-border)',
            '--input-bd-focus': 'var(--mantine-primary-color-filled)',
            '--input-bg': 'var(--mantine-color-default)',
          },
          wrapper: {},
        };
      },
    }),
    Divider: Divider.extend({
      styles: () => ({
        root: {
          borderColor: 'var(--mantine-color-default-border)',
        },
      }),
    }),
    Table: Table.extend({
      styles: () => ({
        table: {
          borderColor: 'var(--mantine-color-default-border)',
        },
        tr: {
          borderColor: 'var(--mantine-color-default-border)',
        },
        th: {
          borderColor: 'var(--mantine-color-default-border)',
        },
        td: {
          borderColor: 'var(--mantine-color-default-border)',
        },
      }),
      classNames: () => ({
        tr: 'globalMantineTableRow',
      }),
    }),
    Checkbox: Checkbox.extend({
      classNames: () => {
        return {
          input: 'globalMantineCheckbox',
        };
      },
      vars: () => ({
        root: {
          '--checkbox-color': 'var(--mantine-primary-color-filled)',
          '--checkbox-icon-color': 'var(--mantine-primary-color-contrast)',
        },
      }),
    }),

    Switch: Switch.extend({
      styles: () => ({
        thumb: {
          backgroundColor: 'var(--mantine-color-default)',
          borderColor: 'var(--mantine-color-default-border)',
        },
        track: {
          borderColor: 'var(--mantine-color-default-border)',
        },
      }),
    }),
    Tooltip: Tooltip.extend({
      styles: () => ({
        tooltip: {
          fontSize: 'var(--mantine-font-size-xs)',
          paddingTop: '0px',
          paddingBottom: '0px',
        },
      }),
      vars: () => ({
        tooltip: {
          '--tooltip-bg': 'var(--mantine-color-primary-color-filled)',
          '--tooltip-color': 'var(--mantine-color-primary-color-contrast)',
        },
      }),
    }),
    Modal: Modal.extend({
      defaultProps: {
        p: 'md',
      },
      styles: () => ({
        content: {
          border: '1px solid var(--mantine-color-default-border)',
        },
      }),
    }),
    Code: Code.extend({
      vars: () => ({
        root: {
          '--code-bg': 'var(--mantine-color-dark-filled)',
        },
      }),
      styles: () => ({
        root: {
          border: '1px solid var(--mantine-color-default-border)',
          color: 'var(--mantine-color-text)',
        },
      }),
    }),
    Spotlight: Spotlight.extend({
      styles: () => ({
        content: {
          border: '1px solid var(--mantine-color-default-border)',
        },
      }),
    }),
    Button: Button.extend({
      classNames: (_theme, props) => {
        if (props.variant !== 'unstyled')
          return {
            root: 'globalMantineButton',
          };

        return {};
      },
    }),
    Anchor: Anchor.extend({
      defaultProps: {
        underline: 'always',
      },
    }),
    HoverCard: HoverCard.extend({
      classNames: () => ({
        dropdown: 'globalMantineHoverCard',
      }),
    }),
    Select: Select.extend({
      defaultProps: {
        checkIconPosition: 'right',
      },
    }),
    // Title: used static class (.mantine-Title-root) to style the title
    // DatePicker: used static classes to style the date picker
  },
});
