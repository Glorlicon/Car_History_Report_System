import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';


type FormWrapperProps = {
    title: string
    children: ReactNode
}
function FormWrapper({ title, children }: FormWrapperProps) {
    const { t, i18n } = useTranslation();
  return (
      <>
          <h3 style={{ textAlign: "center", margin: 0, marginBottom: "2rem" }}>
              {t(title)}
          </h3>
          <div
              style={{
                  display: "grid",
                  gap: "1rem .5rem",
                  justifyContent: "flex-start",
                  gridTemplateColumns: "auto minmax(auto, 400px)",
              }}
          >
              {children}
          </div>
      </>
  );
}

export default FormWrapper;