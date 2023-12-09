import * as React from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BoyIcon from '@mui/icons-material/Boy';
import HailIcon from '@mui/icons-material/Hail';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { jsx as _jsx } from "react/jsx-runtime";

const StyledChip = styled(Chip)(({
  theme
}) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit'
  },
  '&.customer': {
    color: theme.palette.info.dark,
    border: `2px solid ${theme.palette.info.main}`,
    fontWeight: 'bold'
  },
  '&.admin': {
    color: "#731702",
    border: `2px solid #731702`,
    fontWeight: 'bold'
  },
  '&.manager': {
    color: "#6260A6",
    border: `2px solid #6260A6`,
    fontWeight: 'bold'
  },
  '&.staff': {
    color: "#177348",
    border: `2px solid #177348`,
    fontWeight: 'bold'
  }
}));
const Status = /*#__PURE__*/React.memo(props => {
  const {
    status
  } = props;
  let icon = null;

  if (status === 'admin') {
    icon = /*#__PURE__*/_jsx(AdminPanelSettingsIcon, {
      className: "icon"
    });
  } else if (status === 'manager') {
    icon = /*#__PURE__*/_jsx(SupervisorAccountIcon, {
      className: "icon"
    });
  } else if (status === 'staff') {
    icon = /*#__PURE__*/_jsx(BoyIcon, {
      className: "icon"
    });
  } else if (status === 'customer') {
    icon = /*#__PURE__*/_jsx(HailIcon, {
      className: "icon"
    });
  }

  let label = status.charAt(0).toUpperCase() + status.slice(1);

  return /*#__PURE__*/_jsx(StyledChip, {
    className: status,
    icon: icon,
    size: "large",
    label: label,
    variant: "h6"
  });
});
export function renderStatus(params) {

  return /*#__PURE__*/_jsx(Status, {
    status: params.value.toString().toLowerCase()
  });
}