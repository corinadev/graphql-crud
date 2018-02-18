/**
 * Example from: https://github.com/intljusticemission/react-big-calendar/blob/master/examples/demos/dnd.js
 */

import React from 'react';
import { graphql, compose } from 'react-apollo';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import { 
    GET_MEETINGS, 
    UPDATE_MEETING, 
    DELETE_MEETING, 
    CREATE_MEETING 
} from '../../graphql/meetings';
import { create } from 'jss';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

class Agenda extends React.Component {
  saveMeeting({ meeting, start, end }) {
    this.props.updateMeeting({
        variables: { 
            ...meeting,
            startDate: start,
            endDate: end
        },
        update: (store, { data: { updateMeeting } }) => {
            const data = store.readQuery({ query: GET_MEETINGS })
            data.allMeetings[updateMeeting.id] = updateMeeting;
            store.writeQuery({
                query: GET_MEETINGS,
                data,
            })
        },
    });    
  }

  createMeeting = ({ start, end, slots }) => {
    this.props.createMeeting({
      variables: { 
          title: 'Meeting',
          startDate: start,
          endDate: end
      },
      update: (store, { data: { createMeeting } }) => {
          const data = store.readQuery({ query: GET_MEETINGS })
          data.allMeetings.push({ 
            ...createMeeting,
            start: createMeeting.startDate,
            end: createMeeting.endDate
          });
          store.writeQuery({
              query: GET_MEETINGS,
              data,
          })
      },
   });    
  }

  moveMeeting = (info) => {    
    console.log(`${info.meeting.title} was dropped onto ${info.meeting.start}`)    
    this.saveMeeting(info);
  }

  resizeMeeting = (resizeType, { meeting, start, end }) => {
    this.saveMeeting({ meeting, start, end });    
  }

  render() {
    const {
        data,
      } = this.props;
      if (data.loading) return <div>Loading...</div>;
      if (data.error) return <div>Error :(</div>

    const meetings = data.allMeetings.map((meeting) => ({
      ...meeting,
      start: new Date(meeting.start),
      end: new Date(meeting.end)
    }));

    return (
      <DragAndDropCalendar
        selectable
        events={meetings}
        onEventDrop={this.moveMeeting}
        onSelectSlot={this.createMeeting}
        resizable
        onEventResize={this.resizeMeeting}
        defaultView="week"
        defaultDate={new Date(2018, 2, 19)}
      />
    )
  }
}

const AgendaWithData = compose(
    graphql(GET_MEETINGS, { name: 'data' }),
    graphql(UPDATE_MEETING, { name: 'updateMeeting' }),
    graphql(DELETE_MEETING, { name: 'deleteMeeting' }),
    graphql(CREATE_MEETING, { name: 'createMeeting' })
  )(Agenda);

export default DragDropContext(HTML5Backend)(AgendaWithData);