import * as React from 'react';
import { mount } from 'enzyme';
import { pluginDepsToComponents } from '@devexpress/dx-testing';
import { PluginHost } from '@devexpress/dx-react-core';
import { createClickHandlers } from '@devexpress/dx-core';
import { Appointments } from './appointments';

// eslint-disable-next-line react/prop-types
const Appointment = ({ children }) => <div>{ children }</div>;
const AppointmentContent = () => null;

const defaultProps = {
  appointmentComponent: Appointment,
  appointmentContentComponent: AppointmentContent,
};

jest.mock('@devexpress/dx-core', () => ({
  ...require.requireActual('@devexpress/dx-core'),
  createClickHandlers: jest.fn(),
}));

const defaultDeps = {
  template: {
    appointment: {
      type: 'horizontal',
      data: {
        title: 'a',
        endDate: '2018-07-05',
        startDate: '2018-07-06',
      },
      onClick: 'onClick',
      onDoubleClick: 'onDoubleClick',
      style: {
        height: 150,
        width: '60%',
        transform: 'translateY(10px)',
        left: '20%',
        position: 'absolute',
      },
    },
  },
};

describe('Appointments', () => {
  beforeEach(() => {
    createClickHandlers.mockImplementation((click, dblClick) => ({
      onClick: click,
      onDoubleClick: dblClick,
    }));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render appointments', () => {
    const tree = mount((
      <PluginHost>
        {pluginDepsToComponents(defaultDeps)}
        <Appointments
          {...defaultProps}
        />
      </PluginHost>
    ));
    const appointment = tree.find(Appointment);
    const appointmentContent = tree.find(AppointmentContent);
    const { style, data: appointmentData } = appointment.props();
    const { type, data: appointmentContentData } = appointmentContent.props();

    expect(appointment).toHaveLength(1);
    expect(appointmentContent).toHaveLength(1);

    expect(style).toEqual({
      height: 150,
      width: '60%',
      transform: 'translateY(10px)',
      left: '20%',
      position: 'absolute',
    });
    expect(type).toBe('horizontal');
    expect(appointmentData.title).toBe('a');
    expect(appointmentData.endDate).toBe('2018-07-05');
    expect(appointmentData.startDate).toBe('2018-07-06');
    expect(appointmentContentData.title).toBe('a');
    expect(appointmentContentData.endDate).toBe('2018-07-05');
    expect(appointmentContentData.startDate).toBe('2018-07-06');
  });

  it('should pass correct event handlers', () => {
    const appointment = mount((
      <PluginHost>
        {pluginDepsToComponents(defaultDeps)}
        <Appointments
          {...defaultProps}
        />
      </PluginHost>
    )).find(Appointment);

    expect(createClickHandlers)
      .toHaveBeenCalledWith(
        defaultDeps.template.appointment.onClick,
        defaultDeps.template.appointment.onDoubleClick,
      );

    const {
      onClick, onDoubleClick,
    } = appointment.props();

    expect(onClick).toBe('onClick');
    expect(onDoubleClick).toBe('onDoubleClick');
  });
});
