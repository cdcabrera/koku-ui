import {
  Alert,
  Button,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  Modal,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { DollarSignIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { units } from './priceListTier';

interface Props extends InjectedTranslateProps {
  index: number;
  current: CostModel;
  isProcessing: boolean;
  onClose: () => void;
  onProceed: (metric: string, measurement: string, rate: string) => void;
  updateError: string;
}

interface State {
  rate: string;
}

class UpdateRateModelBase extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      rate: String(
        this.props.current.rates[this.props.index].tiered_rates[0].value
      ),
    };
  }
  public render() {
    const {
      updateError,
      current,
      onClose,
      onProceed,
      isProcessing,
      t,
      index,
    } = this.props;
    const metric = current.rates[index].metric.label_metric.toLowerCase();
    const measurement = current.rates[
      index
    ].metric.label_measurement.toLowerCase();

    return (
      <Modal
        isFooterLeftAligned
        title={t('cost_models_details.edit_rate')}
        isOpen
        isSmall
        onClose={onClose}
        actions={[
          <Button
            key="cancel"
            variant="secondary"
            onClick={onClose}
            isDisabled={isProcessing}
          >
            {t('cost_models_details.add_rate_modal.cancel')}
          </Button>,
          <Button
            key="proceed"
            variant="primary"
            onClick={() => onProceed(metric, measurement, this.state.rate)}
            isDisabled={
              !Number(this.state.rate) ||
              Number(this.state.rate) <= 0 ||
              isProcessing
            }
          >
            {t('cost_models_details.add_rate_modal.save')}
          </Button>,
        ]}
      >
        <>
          {updateError && <Alert variant="danger" title={`${updateError}`} />}
          <Stack gutter="md">
            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_details.cost_model.source_type')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>{current.source_type}</Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_wizard.price_list.metric_label')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t(`cost_models_wizard.price_list.${metric}_metric`)}
                </Text>
              </TextContent>
            </StackItem>

            <StackItem>
              <Title size={TitleSize.lg}>
                {t('cost_models_wizard.price_list.measurement_label')}
              </Title>
            </StackItem>
            <StackItem>
              <TextContent>
                <Text component={TextVariants.h6}>
                  {t(`cost_models_wizard.price_list.${measurement}`, {
                    units: units(metric),
                  })}
                </Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <Form>
                <FormGroup
                  label={t('cost_models_wizard.price_list.rate_label')}
                  fieldId="rate-input-box"
                  helperTextInvalid={t(
                    'cost_models_wizard.price_list.rate_error'
                  )}
                  isValid={
                    Number(this.state.rate) && Number(this.state.rate) > 0
                  }
                >
                  <InputGroup style={{ width: '150px' }}>
                    <InputGroupText style={{ borderRight: '0' }}>
                      <DollarSignIcon />
                    </InputGroupText>
                    <TextInput
                      style={{ borderLeft: '0' }}
                      type="text"
                      aria-label={t(
                        'cost_models_wizard.price_list.rate_aria_label'
                      )}
                      id="rate-input-box"
                      value={this.state.rate}
                      onChange={(rate: string) => this.setState({ rate })}
                      isValid={
                        Number(this.state.rate) && Number(this.state.rate) > 0
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </Form>
            </StackItem>
          </Stack>
        </>
      </Modal>
    );
  }
}

export default UpdateRateModelBase;
