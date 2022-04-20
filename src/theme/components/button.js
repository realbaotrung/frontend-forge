// import type {
//   SystemStyleObject,
// } from '@chakra-ui/theme-tools';
// import { Dict } from '@chakra-ui/utils';

// const baseStyle: SystemStyleObject = {
const baseStyle = {
  borderRadius: 'base',
  _focus: {
    boxShadow: 'none',
    bg: 'NeutralLight.N700',
    color: 'NeutralLight.N0',
  },
  _hover: {
    _disabled: {
      opacity: 1,
      color: 'NeutralLight.N70',
    },
  },
  _disabled: {
    opacity: 1,
    color: 'NeutralLight.N70',
  },
};

// const variantPrimary = (): SystemStyleObject => ({
const variantPrimary = () => ({
  bg: 'Blue.B400',
  color: 'NeutralLight.N0',
  _hover: {
    bg: 'Blue.B300',
    color: 'NeutralLight.N0',
    _disabled: {
      bg: 'NeutralLightAlpha.N20A',
    },
  },
  _active: {
    bg: 'Blue.B500',
    color: 'NeutralLight.N0',
  },
  _disabled: {
    bg: 'NeutralLightAlpha.N20A',
  },
});

// const variantWarning = (): SystemStyleObject => ({
const variantWarning = () => ({
  bg: 'Yellow.Y300',
  color: 'NeutralLight.N800',
  _hover: {
    bg: 'Yellow.Y200',
    color: 'NeutralLight.N800',
    _disabled: {
      bg: 'NeutralLightAlpha.N20A',
    },
  },
  _active: {
    bg: 'Yellow.Y400',
    color: 'NeutralLight.N800',
  },
  _disabled: {
    bg: 'NeutralLightAlpha.N20A',
  },
  _focus: {
    bg: 'Yellow.Y400',
    color: 'NeutralLight.N800',
  },
});

// const variantDanger = (): SystemStyleObject => ({
const variantDanger = () => ({
  bg: 'Red.R400',
  color: 'NeutralLight.N0',
  _hover: {
    bg: 'Red.R300',
    color: 'NeutralLight.N0',
    _disabled: {
      bg: 'NeutralLightAlpha.N20A',
    },
  },
  _active: {
    bg: 'Red.R500',
    color: 'NeutralLight.N0',
  },
  _disabled: {
    bg: 'NeutralLightAlpha.N20A',
  },
  _focus: {
    bg: 'Red.R500',
    color: 'NeutralLight.N0',
  },
});

// const variantSolid = (): SystemStyleObject => ({
const variantSolid = () => ({
  bg: 'NeutralLightAlpha.N30A',
  color: 'NeutralLight.N500',
  _hover: {
    bg: 'NeutralLightAlpha.N40A',
    color: 'NeutralLight.N500',
    _disabled: {
      bg: 'NeutralLightAlpha.N30A',
    },
  },
  _active: {
    bg: 'rgba(179, 212, 255, 0.6)',
    color: 'Blue.B400',
  },
  _disabled: {
    bg: 'NeutralLightAlpha.N30A',
  },
});

// const variantLink = (): SystemStyleObject => ({
const variantLink = () => ({
  color: 'Blue.B400',
  _hover: {
    color: 'Blue.B300',
    bg: 'NeutralLight.N0',
  },
  _active: {
    color: 'Blue.B500',
    bg: 'NeutralLight.N0',
    textDecoration: 'none',
  },
});

// const variantGhost = (): SystemStyleObject => ({
const variantGhost = () => ({
  color: 'NeutralLight.N500',
  _hover: {
    bg: 'NeutralLightAlpha.N30A',
    color: 'NeutralLight.N500',
  },
  _active: {
    bg: 'rgba(179, 212, 255, 0.6)',
    color: 'Blue.B400',
  },
});

const variants = {
  solid: variantSolid,
  primary: variantPrimary,
  warning: variantWarning,
  danger: variantDanger,
  link: variantLink,
  ghost: variantGhost,
};

// const sizes: Dict<SystemStyleObject> = {
const sizes = {
  md: {
    h: 8,
    minW: 8,
    fontSize: 'sm',
    px: 3,
  },
  sm: {
    h: 6,
    minW: 8,
    fontSize: 'sm',
    px: 3,
  },
};

export default {
  baseStyle,
  variants,
  sizes,
};

/* eslint import/no-anonymous-default-export: 0 */
