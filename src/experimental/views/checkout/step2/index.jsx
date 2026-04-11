import { CHECKOUT_STEP_3 } from "@/constants/routes";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Boundary } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setShippingDetails } from "@/redux/actions/checkoutActions";
import { updateProfile } from "@/redux/actions/profileActions";
import * as Yup from "yup";
import { StepTracker } from "@/views/checkout/components";
import withCheckoutV2 from "../hoc/withCheckoutV2";
import ShippingForm from "@/views/checkout/step2/ShippingForm";

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  email: Yup.string()
    .email("Email is not valid.")
    .required("Email is required."),
  street: Yup.string().required("Street is required."),
  city: Yup.string().required("City is required."),
  building: Yup.string().required("Building is required."),
  floor: Yup.number().required("Floor number is required."),
  zipcode: Yup.number(),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required("Mobile number is required"),
      value: Yup.string().required("Mobile number is required"),
    })
    .required("Mobile number is required."),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean(),
});

const ShippingDetailsV2 = ({ profile, shipping, subtotal }) => {
  useDocumentTitle("Check Out Step 2 | Urbanfit");
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || "",
    email: shipping.email || profile.email || "",
    address: shipping.address || profile.address || "",
    country: shipping.country || profile.country || "",
    street: shipping.street || profile.street || "",
    city: shipping.city || profile.city || "",
    building: shipping.building || profile.building || "",
    floor: shipping.floor || profile.floor || "",
    zipcode: shipping.zipcode || profile.zipcode || "",
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false,
  };

  const onSubmitForm = (form) => {
    dispatch(
      setShippingDetails({
        fullname: form.fullname,
        email: form.email,
        country: form.country,
        street: form.street,
        city: form.city,
        building: form.building,
        floor: form.floor,
        zipcode: form.zipcode,
        mobile: form.mobile,
        isInternational: form.isInternational,
        isDone: true,
      })
    );

    const profileUpdates = {
      fullname: form.fullname,
      country: form.country,
      street: form.street,
      city: form.city,
      building: form.building,
      floor: form.floor,
      zipcode: form.zipcode,
      mobile: form.mobile,
    };

    dispatch(updateProfile({ updates: profileUpdates, redirect: false }));
    history.push(CHECKOUT_STEP_3);
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                <ShippingForm />
                <br />
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                    style={{ fontSize: "1.3rem" }}
                  >
                    <ArrowLeftOutlined />
                    &nbsp; Go Back
                  </button>
                  <button
                    className="button button-icon"
                    type="submit"
                    id="next"
                    style={{ fontSize: "1.3rem" }}
                  >
                    Next Step &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Boundary>
  );
};

export default withCheckoutV2(ShippingDetailsV2);