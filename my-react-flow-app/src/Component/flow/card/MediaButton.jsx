import React, { memo, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FaRocket,
  FaTimes,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaRegSmile,
  FaLink,
  FaPhoneAlt,
  FaRegClone,
  FaReply,
  FaThLarge,
} from "react-icons/fa";
import CardHeader from "../component/CardHeader";

const MediaButton = ({ data }) => {
  return(
    <div>
        <CardHeader data={data} name="Media + Button"/>
    </div>
  )
};

export default memo(MediaButton);
