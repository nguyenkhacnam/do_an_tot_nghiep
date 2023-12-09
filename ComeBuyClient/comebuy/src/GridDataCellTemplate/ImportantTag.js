import * as React from 'react';
import clsx from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import { jsx as _jsx } from "react/jsx-runtime";
const Value = styled('div')(({
  theme
}) => ({
  width: '100%',
  height: '100%',
  lineHeight: '100%',
  paddingRight: 8,
  fontVariantNumeric: 'tabular-nums',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  '&.good': {
    backgroundColor: alpha(theme.palette.success.main, 0.3)
  },
  '&.bad': {
    backgroundColor: alpha(theme.palette.error.main, 0.3)
  }
}));
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
const TotalPrice = /*#__PURE__*/React.memo(function TotalPrice(props) {
  const {
    value,
    delimitedValue

  } = props;
  return /*#__PURE__*/_jsx(Value, {
    className: clsx(value > delimitedValue && "good", value <= delimitedValue && "bad"),
    children: currencyFormatter.format(value)
  });
});

//// delimitedValue la gia tri phan dinh giua good and bad 

export function renderImportantTag(params, _delimitdeValue) {
  return /*#__PURE__*/_jsx(TotalPrice, {
    value: params,
    delimitedValue: _delimitdeValue
  });
}