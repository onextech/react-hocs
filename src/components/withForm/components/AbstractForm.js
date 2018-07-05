import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Grid, Form, Menu } from 'semantic-ui-react'
import { CLASS_FIELD_CHECKBOX, CLASS_LABEL_CHECKBOX } from '../constants/field'

const StyledForm = styled(Form)`
  &.ui.form {
    font-size: 1.1rem;
    .field {
      margin-bottom: 1.5em;
      &.${CLASS_FIELD_CHECKBOX} {
        display: flex;
        justify-content: space-between;
        height: 45px; // height of field components does not change dynamically
        align-items: center;
        .${CLASS_LABEL_CHECKBOX} {
          &:hover {
            cursor: pointer;
          }
        }
        .ui.checkbox {
          &:after {
            content: '';
          }
        }
      }
    }
  }
`

const AdminCard = styled.div`
  padding: 2rem;
  background-color: white;
  box-shadow: 0 1px 12px rgba(0,0,0,0.1); 
`

const AbstractForm = (props) => {
  const { record, state, components, basic } = props
  const { failure, success } = state
  const { renderSubmitButton, renderErrors, renderFields, renderLoading } = components

  if (basic) {
    return (
      <div>
        {renderLoading()}
        <StyledForm error={failure} success={success}>
          {renderFields()}
          {renderErrors()}
          {renderSubmitButton()}
        </StyledForm>
      </div>
    )
  }

  return (
    <div>
      {renderLoading()}
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={record ? 11 : 16}>
            <StyledForm error={failure} success={success}>
              <AdminCard>
                {renderFields()}
                {renderErrors()}
              </AdminCard>
              <Menu fixed={record ? 'bottom' : null} style={{ marginTop: 0 }}>
                <Menu.Menu position='right' style={{ padding: '.5em 2em' }}>
                  <Menu.Item style={{ paddingRight: 0 }}>
                    {renderSubmitButton()}
                  </Menu.Item>
                </Menu.Menu>
              </Menu>
            </StyledForm>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

AbstractForm.propTypes = {
  record: PropTypes.object,
  state: PropTypes.shape({
    failure: PropTypes.bool,
    success: PropTypes.bool,
  }).isRequired,
  components: PropTypes.shape({
    renderSubmitButton: PropTypes.func.isRequired,
    renderErrors: PropTypes.func.isRequired,
    renderFields: PropTypes.func.isRequired,
    renderLoading: PropTypes.func.isRequired,
  }).isRequired,
  basic: PropTypes.bool,
};

AbstractForm.defaultProps = {
  record: undefined,
  basic: undefined,
};

export default AbstractForm
