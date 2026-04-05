-- ==========================================
-- CSE216 PROJECT FEATURES (Triggers, Functions, Procedures)
-- ==========================================

-- 1. TRIGGER
-- Prevents booking an appointment in the past directly at the database level
CREATE OR REPLACE TRIGGER trg_check_appointment_date
BEFORE INSERT OR UPDATE ON DOCTORS_APPOINTMENTS
FOR EACH ROW
BEGIN
    IF :NEW.APPOINTMENT_DATE < TRUNC(SYSDATE) THEN
        RAISE_APPLICATION_ERROR(-20001, 'Database Error: Appointment date cannot be in the past!');
    END IF;
END;
/

-- 2. FUNCTION
-- Calculates the total number of appointments a patient has made
CREATE OR REPLACE FUNCTION get_patient_total_appointments (p_patient_id IN NUMBER)
RETURN NUMBER IS
    v_total NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_total 
    FROM DOCTORS_APPOINTMENTS 
    WHERE PATIENT_ID = p_patient_id;
    
    RETURN v_total;
END;
/

-- 3. PROCEDURE
-- Multi-step workflow to book an appointment (Inserts appointment AND locks the time slot)
CREATE OR REPLACE PROCEDURE proc_book_appointment (
    p_patient_id IN NUMBER,
    p_doctor_id IN NUMBER,
    p_appointment_date IN DATE,
    p_time_slot_id IN NUMBER,
    p_type IN VARCHAR2
) AS
BEGIN
    -- Step A: Insert the appointment record
    INSERT INTO DOCTORS_APPOINTMENTS
        (PATIENT_ID, DOCTOR_ID, APPOINTMENT_DATE, TIME_SLOT_ID, STATUS, TYPE)
    VALUES
        (p_patient_id, p_doctor_id, p_appointment_date, p_time_slot_id, 'BOOKED', p_type);

    -- Step B: Update the timeslot to mark it as booked
    UPDATE TIME_SLOTS
    SET STATUS = 'BOOKED',
        LAST_EDITED_AT = SYSDATE
    WHERE ID = p_time_slot_id
      AND DOCTOR_ID = p_doctor_id;
      
    -- Note: COMMIT is executed by the Node.js backend to fulfill Checklist #3
END;
/
