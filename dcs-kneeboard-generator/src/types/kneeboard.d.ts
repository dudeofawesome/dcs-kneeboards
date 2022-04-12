/** A Kneeboard definition */
export interface Kneeboard {
  /**
   * The name of the kneeboard.
   * @example Startup checklist
   */
  name: string;
  /**
   * The name of the kneeboard, written in a URI-safe way.
   * @example startup-checklist
   */
  slug: string;
  /** The subject object of the kneeboard. */
  subject_object: {
    /**
     * The name of the subject.
     * @example F/A-18C
     */
    name: string;
    /**
     * The name of the subject, written in a URI-safe way.
     * @example FA-18C
     */
    slug: string;
  };
  /** A list of color and/or symbols used in the kneeboard. */
  key?: Key;
  /** Description of what this kneeboard contains. */
  description?: string;
  /** Sections of the kneeboard. */
  sections: Section[];
}

/** A list of color and/or symbols used in the kneeboard. */
export interface Key {
  /** A list of colors that indicate things. */
  colors?: Record<string, KeyColor>;
}

/** A color that indicates something */
export interface KeyColor {
  /** What the color indicates */
  name: string;
  /** The color used */
  color: string;
}

/** A section of the kneeboard */
export interface Section {
  /** The name of the subject. */
  name: string;
  /** A further description of the section. */
  description?: string;
  /** The steps for this section. */
  steps: Step[];
}

/** A step of a section */
export interface Step {
  /** The name of the step. If talking about a specific item it can be a good idea to use the name as labeled. **/
  name: string;
  /** The physical location of the control. **/
  control_location?: string;
  /** The desired setting for the control. **/
  state?: string;
  /** A further description of the step. Sometimes useful if there's a change to watch for after the action. **/
  substep?: string;
  /** The physical location of the sub-step's control. **/
  substep_location?: string;
  /** The desired state for the sub-step. **/
  substep_state?: string;
  /** The name of the color key, as defined in Kneeboard::key::colors */
  color_key?: string;
}
