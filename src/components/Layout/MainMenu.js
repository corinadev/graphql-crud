// This file is shared across the demos.

import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
import DeleteIcon from 'material-ui-icons/Delete';
import ReportIcon from 'material-ui-icons/Report';
import {
    Link
  } from 'react-router-dom'

export const mainMenuItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button component={Link} to="/agenda">
      <ListItemIcon>
        <StarIcon />
      </ListItemIcon>
      <ListItemText primary="Agenda" />
    </ListItem>
    <ListItem button component={Link} to="/employees">
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Employees" />
    </ListItem>
    <ListItem button component={Link} to="/products">
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>
    <ListItem button component={Link} to="/products-editable">
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <ListItemText primary="Products 2" />
    </ListItem>
  </div>
);