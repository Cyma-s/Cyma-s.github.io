import { Text } from "@primer/components";
import React from "react";

function Caption(props) {
  return (
    <Text
      as="figcaption"
      textAlign="center"
      mt={2}
      mb={3}
      fontSize={1}
      color="auto.gray.5"
      {...props}
    />
  );
}

export default Caption;
